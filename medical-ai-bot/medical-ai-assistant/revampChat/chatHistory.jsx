import useScreenWidth from "@/hooks/useScreenWidth";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import MuiTypography from "@/components/core/Typography";
import { formatTime, stringAvatar } from "@/lib/utils";
import InputField from "@/components/core/Input";
import { BsFillSendFill } from "react-icons/bs";
import { BeatLoader } from "react-spinners";
import { CHAT_TYPE } from "@/config";
import Image from "next/image";
import EndSessionModal from "./endSessionModal";
import ErrorModal from "./errorModal";
import SuggestedDoctorModal from "./suggestedDoctorModal";
import moment from "moment";

const StyledInnerBox = styled(Box)`
  max-width: 400px;
  width: 100%;
  margin: auto;
  text-align: center;
`;

const StyledUserChatContainer = styled(Box)`
  flex: 1;
  display: ${(props) => {
    return props.screenWidth < 992
      ? props.showMessanger === false
        ? "none"
        : "flex"
      : "flex";
  }};
`;

const ScrollableBox = styled(Box)`
  overflow: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  ::-webkit-scrollbar {
    width: 0;
    display: none;
  }
`;

const SendButton = styled(IconButton)`
  margin-right: 0px;
  background-color: rgb(224, 40, 40);
  :hover {
    background-color: rgb(224, 40, 40);
  }
`;

const StyledButton = styled(Button)`
  && {
    background: #e02828;
    font-weight: bold;
    border: none;
    &:hover {
      background: #e02828;
      border: none;
    }
  }
`;

const INPUT_FIELD_PROPS_MESSAGE = {
  label: "",
  fullWidth: true,
  variant: "standard",
};

const INPUT_FIELD_STYLES_MESSAGE = {
  sx: {
    width: "100%",
    height: "55px",
    borderRadius: "50px",
    "& fieldset": { border: "1px solid #D2D2D2" },
  },
};

const ChatHistory = ({
  selectedSessionId,
  setChatItemsState,
  chatType,
  setSelectedSessionId,
  isSessionClosed,
  setIsSessionClosed,
}) => {
  const session = useSession();
  let userID = session?.data?.user?.user?.userId;

  const screenWidth = useScreenWidth();
  const bottomRef = useRef(null);
  const [inputStr, setInputStr] = useState("");
  const [endSessionModal, setEndSessionModal] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [isloading, setIsLoading] = useState(false);
  const [lastHistory, setLastHistory] = useState(null);
  const [departmentError, setDepartmentError] = useState(null);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [suggestedDoctorModal, setSuggestedDoctorModal] = useState(false);
  const [suggestedDepartment, setSuggestedDepartment] = useState(null);
  const [endSessionLoading, setEndSessionLoading] = useState(false);
  const [recomendedDoctorLoading, setRecomendedDoctorLoading] = useState(false);

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const scrollToBottom = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const getSingleChatHistory = async () => {
      try {
        const finalPayload = {
          user_id: userID || "",
          session_id: selectedSessionId || "",
        };

        let url =
          chatType === CHAT_TYPE.prescription
            ? `https://medical-aibe.xeventechnologies.com/get_general_physician_specific_chat`
            : `https://medical-aibe.xeventechnologies.com/get_psychiatrist_specific_chat`;

        const response = await axios.post(url, finalPayload);
        console.log("response:::", response);
        if (response?.data?.history) {
          setChatHistory(response?.data?.history);
          setLastHistory(response?.data?.history);
          setIsSessionClosed(response?.data?.is_chat);
        } else {
          setChatHistory([]);
        }
      } catch (error) {
        console.log("error", error);
      }
    };

    if (selectedSessionId) {
      getSingleChatHistory();
    } else {
      setChatHistory([]);
    }
  }, [session, selectedSessionId]);
  let showMessanger = true;
  const getCurrentTime = () => {
    return moment().format("h:mm A");
  };
  const sendMessageHandler = async () => {
    try {
      if (!inputStr.trim()) return;
      setIsLoading(true);
      setChatHistory((prev) => [
        ...prev,
        {
          user: inputStr,
          timestamp: getCurrentTime(),
        },
      ]);
      setInputStr("");

      let url =
        chatType === CHAT_TYPE.prescription
          ? `https://medical-aibe.xeventechnologies.com/generate_prescription_from_chat_session?user_query=${inputStr}&user_id=${userID}&session_id=${selectedSessionId}`
          : `https://medical-aibe.xeventechnologies.com/psychiatrist_chat_session?user_query=${inputStr}&user_id=${userID}&session_id=${selectedSessionId}`;

      let response = await axios.post(url, null);

      if (
        response &&
        response?.data &&
        response?.data?.data &&
        response?.data?.data?.length > 0
      ) {
        setChatHistory((prev) => [
          ...prev,
          {
            AiRes: response?.data?.data[0]?.generated_text,
            timestamp: getCurrentTime(),
          },
        ]);

        if (chatHistory.length === 0) {
          setChatItemsState((prev) => [
            {
              session_id: selectedSessionId,
              title: response?.data?.data[0]?.title,
            },
            ...prev,
          ]);
        }
        setIsSessionClosed(false);
        setLastHistory(response?.data?.data[0]?.history);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessageHandler();
    }
  };

  const getRandomSessionId = async () => {
    try {
      const response = await axios.get(
        "https://medical-aibe.xeventechnologies.com/generate_random_session_id"
      );
      if (
        response &&
        response?.data &&
        response?.data?.data &&
        response?.data?.data?.length > 0
      ) {
        setSelectedSessionId(response?.data?.data[0]?.session_id);
        setIsSessionClosed(false);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const confirmhandler = async () => {
    setEndSessionLoading(true);

    try {
      const response = await axios.post(
        `https://medical-aibe.xeventechnologies.com/get_doctor_field_and_department_from_history`,
        {
          history: [`${JSON.stringify(lastHistory)}`],
        }
      );

      if (response?.data?.succeeded === true) {
        if (response.data?.data?.[0]?.department) {
          setSuggestedDepartment(response.data?.data?.[0]?.department);

          let url =
            chatType === CHAT_TYPE.prescription
              ? `https://medical-aibe.xeventechnologies.com/generate_general_physician_chat_title?user_id=${userID}&session_id=${selectedSessionId}`
              : `https://medical-aibe.xeventechnologies.com/generate_psychiatrist_chat_title?user_id=${userID}&session_id=${selectedSessionId}`;

          const generateTittleResponse = await axios.post(url, null);
          console.log(
            "generateTittleResponse?.data?.title",
            generateTittleResponse?.data?.title
          );
          if (generateTittleResponse?.data?.title) {
            setIsSessionClosed(true);
            setEndSessionModal(false);
            setSuggestedDoctorModal(true);
            setEndSessionLoading(false);
          } else {
            setEndSessionModal(false);
            setSuggestedDoctorModal(false);
            setEndSessionLoading(false);
          }
        }
      } else {
        setSuggestedDepartment(null);
        setDepartmentError(response?.data?.message || "Errror");
        setErrorModalOpen(true);
        setEndSessionModal(false);
        setEndSessionLoading(false);
      }
    } catch (error) {
      console.log("error", error);
      setEndSessionLoading(false);
    }
  };

  const getRecomendedDoctor = async () => {
    try {
      setRecomendedDoctorLoading(true);
      const response = await axios.post(
        `https://medical-aibe.xeventechnologies.com/get_doctor_field_and_department_from_history`,
        {
          history: [`${JSON.stringify(lastHistory)}`],
        }
      );
      console.log("response::::", response);

      if (response?.data?.succeeded === true) {
        if (response.data?.data?.[0]?.department) {
          setSuggestedDepartment(response.data?.data?.[0]?.department);
          setEndSessionModal(false);
          setSuggestedDoctorModal(true);
          setEndSessionLoading(false);
          setRecomendedDoctorLoading(false);
        }
      }
    } catch (error) {
      setRecomendedDoctorLoading(false);
    }
  };

  {
    console.log(
      "suggestedDoctorModal",
      suggestedDoctorModal,
      "departmentError",
      departmentError,
      "suggestedDepartment",
      suggestedDepartment
    );
  }

  //   suggestedDoctorModal
  // !departmentError
  // suggestedDepartment
console.log("chatHistory:::",chatHistory);
  return (
    <StyledUserChatContainer
      screenWidth={screenWidth}
      showMessanger={showMessanger}
      sx={{
        borderLeft:
          screenWidth < 992 && !showMessanger ? "1px solid #C3C3C3" : "none",
      }}
      display="flex"
      justifyContent="space-between"
      flexDirection="column"
    >
      {chatHistory?.length > 0 && isSessionClosed === false && (
        <Box
          display="flex"
          alignItems="center"
          width="100%"
          justifyContent="end"
        >
          <StyledButton
            sx={{
              py: 1,
              px: 3,
              my: 2,
              mx: 2,
              color: "white",
              justifyContent: "end",
            }}
            cursor="pointer"
            //   onClick={handleShowDepartmentModal}
            //   startIcon={<CommentsDisabledIcon />}
            onClick={() => setEndSessionModal(true)}
          >
            End Session
          </StyledButton>
        </Box>
      )}

      {chatHistory?.length > 0 && isSessionClosed === true && (
        <Box
          display="flex"
          alignItems="center"
          width="100%"
          justifyContent="end"
        >
          <StyledButton
            sx={{
              py: 1,
              px: 3,
              my: 2,
              mx: 2,
              color: "white",
              justifyContent: "end",
              textTransform: "capitalize",
            }}
            cursor="pointer"
            //   onClick={handleShowDepartmentModal}
            //   startIcon={<CommentsDisabledIcon />}
            onClick={() =>
              recomendedDoctorLoading === false && getRecomendedDoctor()
            }
          >
            {recomendedDoctorLoading === true
              ? "Suggesting..."
              : "Recomended Doctors"}
          </StyledButton>
        </Box>
      )}

      {chatHistory.length > 0 && (
        <ScrollableBox
          sx={{ flex: 1 }}
          p={2}
          backgroundColor="#fff"
          id="chatmodule"
          style={{ height: `calc(100vh - 349px)` }}
        >
          {chatHistory.map((item, index) => (
            <Box key={index} my={2}>
              {item?.user && (
                <Box display="flex" flexDirection="row-reverse">
                  <Avatar
                    {...stringAvatar(session?.data?.user?.user?.name)}
                    sx={{
                      bgcolor: "rgb(224, 40, 40)",
                      width: 40,
                      height: 40,
                      mr: 1,
                      ml: 1,
                      p: "6px",
                      mt: "6px",
                    }}
                  />
                  <Box>
                    <Box
                      width="fit-content"
                      bgcolor={"#E02828"}
                      p={2}
                      m={`0px 0px 0px auto`}
                      sx={{
                        textAlign: "right",
                        border: `1px solid none`,
                        borderRadius: "20px 20px 0px 20px",
                      }}
                    >
                      <MuiTypography
                        textAlign="start"
                        variant="subtitle1"
                        fontWeight="400"
                        color={"#fff"}
                      >
                        {item?.user
                          ?.replace("User:", "")
                          .replace("<END_OF_TURN>", "")
                          .trim()}
                      </MuiTypography>
                    </Box>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <MuiTypography
                        variant="subtitle1"
                        fontWeight="400"
                        fontSize="12px"
                        color="#9C9C9C"
                        sx={{
                          pt: 1,
                          textAlign: "left",
                        }}
                      >
                        {item.time
                          ? moment(item.time).format("h:mm A")
                          : item?.timestamp}
                      </MuiTypography>
                      {/* <MuiTypography
                        variant="subtitle1"
                        fontWeight="400"
                        fontSize="12px"
                        color="#9C9C9C"
                        sx={{
                          pt: 1,
                          textAlign: "right",
                        }}
                      >
                        {item.time ? formatTime(item.time) : item?.timestamp}
                      </MuiTypography> */}
                    </Box>
                  </Box>
                </Box>
              )}

              {item?.AiRes && (
                <Box display="flex" flexDirection="row">
                  <Avatar
                    {...stringAvatar("A I")}
                    sx={{
                      bgcolor: "rgb(224, 40, 40)",
                      width: 40,
                      height: 40,
                      mr: 1,
                      ml: 1,
                      p: "6px",
                      mt: "6px",
                    }}
                  />
                  <Box>
                    <Box
                      width="fit-content"
                      bgcolor={"none"}
                      p={2}
                      m={`0px 0px 0px 0px`}
                      sx={{
                        textAlign: "left",
                        border: `1px solid #E3E3E3`,
                        borderRadius: "20px 20px 20px 0px",
                      }}
                    >
                      <MuiTypography
                        textAlign="start"
                        variant="subtitle1"
                        fontWeight="400"
                        color={"#000"}
                      >
                        {item?.AiRes?.replace("William:", "")
                          .replace("<END_OF_TURN>", "")
                          .trim()}
                      </MuiTypography>
                    </Box>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <MuiTypography
                        variant="subtitle1"
                        fontWeight="400"
                        fontSize="12px"
                        color="#9C9C9C"
                        sx={{
                          pt: 1,
                          textAlign: "left",
                        }}
                      >
                        {item.time
                          ? moment(item.time).format("h:mm A")
                          : item?.timestamp}
                      </MuiTypography>
                      {/* <MuiTypography
                        variant="subtitle1"
                        fontWeight="400"
                        fontSize="12px"
                        color="#9C9C9C"
                        sx={{
                          pt: 1,
                          textAlign: "right",
                        }}
                      >
                        {item.time ? formatTime(item.time) : item?.timestamp}
                      </MuiTypography> */}
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
          ))}
          <div ref={bottomRef} />
        </ScrollableBox>
      )}

      {selectedSessionId && chatHistory.length === 0 && (
        <Box
          sx={{
            flex: 1,
            p: 2,
            backgroundColor: "#fff",
            id: "chatmodule",
            height: `calc(100vh - 349px)`,
            overflow: "auto",
            display: "flex",
            flexDirection: "column", // Stack children vertically
            justifyContent: "center", // Center children vertically
            alignItems: "center", // Center children horizontally
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <img
              src="/images/newChat.png"
              alt="Icon representing starting a new chat"
            />
          </Box>
          <Box mt={2} textAlign="center">
            <Typography>Start New Chat</Typography>
          </Box>
        </Box>
      )}

      {!selectedSessionId && (
        <StyledInnerBox>
          <div
            style={{
              position: "relative",
              height: "200px",
              maxWidth: "200px",
              margin: "auto",
            }}
          >
            <Image
              src={"/images/doctor-avatar.png"}
              loading="lazy"
              layout="fill"
              objectFit="contain"
              style={{
                objectFit: "contain",
              }}
              alt="user-img"
            />
          </div>

          <MuiTypography
            variant="body1"
            component="p"
            color="#000"
            sx={{ my: 2 }}
          >
            Hi there! I am doctor bot. I am here to help you diagnose your
            symptoms and find a better treatment plan for you.
          </MuiTypography>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-around",
            }}
          >
            <Button
              variant="contain"
              height="45px"
              radius="12px"
              width="160px"
              marginLeft="20px"
              marginBottom="10px"
              sx={{
                marginBottom: "10px",
                background: "#E02828",
                textTransform: "capitalize",
                color: "#fff",
                "&:hover": {
                  background: "#E02828",
                  textTransform: "capitalize",
                },
              }}
              onClick={() => getRandomSessionId()}
            >
              Start Chat
            </Button>
          </Box>
        </StyledInnerBox>
      )}

      {isloading && (
        <BeatLoader
          style={{ marginLeft: "70px" }}
          color="#000000"
          size="10px"
        />
      )}

      {selectedSessionId && isSessionClosed === false && (
        <Box sx={{ borderTop: "1px solid #C3C3C3" }} p={2}>
          <Box sx={{ flex: 1 }}>
            <InputField
              id="outlined-adornment-password"
              type="text"
              placeholder="Type a message here…"
              value={inputStr}
              onChange={(e) => setInputStr(e.target.value)}
              onKeyDown={handleKeyPress}
              endAdornment={
                <InputAdornment position="end">
                  <SendButton
                    aria-label="send message"
                    edge="end"
                    disabled={inputStr.length === 0}
                    sx={{
                      background: "rgb(224, 40, 40)",
                      marginRight: "2px",
                      "&:hover": {
                        background: "rgb(224, 40, 40)",
                      },
                      "&.Mui-disabled": {
                        background: "rgb(224, 40, 40)",
                        color: "#fff", // Ensure the text/icon color remains white
                      },
                    }}
                    onClick={sendMessageHandler}
                  >
                    <BsFillSendFill color="#fff" size={20} />
                  </SendButton>
                </InputAdornment>
              }
              sx={INPUT_FIELD_STYLES_MESSAGE.sx}
              {...INPUT_FIELD_PROPS_MESSAGE}
            />
          </Box>
        </Box>
      )}

      {endSessionModal && (
        <EndSessionModal
          open={endSessionModal}
          handleClose={() => setEndSessionModal(false)}
          tittle="Session End "
          onConfirm={() => confirmhandler()}
          loading={endSessionLoading}
        />
      )}

      {errorModalOpen && departmentError && (
        <ErrorModal
          open={errorModalOpen}
          handleClose={() => {
            setErrorModalOpen(false);
            setSuggestedDepartment(null);
            setDepartmentError(null);
            setErrorModalOpen(false);
            setEndSessionModal(false);
          }}
          tittle="Error While generating Department "
          onConfirm={() => confirmhandler()}
          departmentError={departmentError}
        />
      )}

      {suggestedDoctorModal &&
        !departmentError &&
        suggestedDepartment !== null && (
          <SuggestedDoctorModal
            open={suggestedDoctorModal}
            handleClose={() => setSuggestedDoctorModal(false)}
            tittle="Suggested By MedicalAI Bot "
            onConfirm={() => confirmhandler()}
            suggestedDepartment={suggestedDepartment}
            selectedSessionId={selectedSessionId}
          />
        )}
    </StyledUserChatContainer>
  );
};

export default ChatHistory;
