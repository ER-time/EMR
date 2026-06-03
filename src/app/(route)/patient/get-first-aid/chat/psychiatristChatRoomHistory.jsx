"use client";

import { Box } from "@/components";
import InputField from "@/components/core/Input";
import MuiTypography from "@/components/core/Typography";
import useScreenWidth from "@/hooks/useScreenWidth";
import {
  Avatar,
  Button,
  IconButton,
  InputAdornment,
  Typography,
} from "@mui/material";
import styled from "styled-components";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useEffect, useRef, useState } from "react";
import { BsFillSendFill } from "react-icons/bs";
import moment from "moment";
import { stringAvatar } from "@/lib/utils";
import { BeatLoader } from "react-spinners";
import {
  useGeneratePrescriptionFromChatSessionMutation,
  usePsychiatristChatSessionMutation,
} from "@/redux/slices/chat";
import { useSession } from "next-auth/react";
import axios from "axios";
import DepartmentModal from "./DepartmentModal";
import { useRouter } from "next/navigation";
import { useLazyGetDoctorsByDeptNameQuery } from "@/redux/slices/doctors";
import CommentsDisabledIcon from "@mui/icons-material/CommentsDisabled";
import { onFailure } from "@/redux/features/apiStatusSlice";
import { useDispatch } from "react-redux";
import SuggestedDepartmentsModal from "./SuggestedDoctorsModal";
const StyledUserChatContainer = styled(Box)`
  display: ${(props) => {
    props.screenWidth < 992
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

export default function PsychiatristChatRoomHistory({
  showMessanger,
  setShowMessanger,
  selectedInbox,
  messageArray,
  setMessageArray,
  randomNo,
  SetDept,
  dept,
  doctorList,
  setDoctorList,
  setShowDepartmentModal,
  showDepartmentModal,
  setRefreshTitle,
  setSpecificChatHistory,
  specificChatHistory,
  setIsChatEnded,
  isChatEnded,
}) {
  console.log("isChatEnded:::::=====>", isChatEnded);
  const screenWidth = useScreenWidth();
  const session = useSession();
  let userID = session?.data?.user?.user?.userId;
  const [inputStr, setInputStr] = useState("");
  const bottomRef = useRef(null);
  const [historyData, setHistoryData] = useState([]);
  const dispatch = useDispatch();
  const [showDoctors, setShowDoctors] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const getSingleChatHistory = async () => {
      try {
        const payload = {
          user_id: userID || "",
          session_id: selectedInbox.session_id || "",
        };
        const response = await axios.post(
          "https://medical-aibe.xeventechnologies.com/get_psychiatrist_specific_chat",
          { ...payload }
        );
        console.log("response::::", response);
        setIsChatEnded(response?.data?.is_chat || false);
        const chatHistory = response.data?.history || [];
        setHistoryData(response);
        setSpecificChatHistory(chatHistory);
        setRefreshTitle((pre) => !pre);
        const formattedMessages = chatHistory
          .map((item) => {
            return [
              {
                type: "outgoing",
                message: item.user
                  .replace("User:", "")
                  .replace("<END_OF_TURN>", "")
                  .trim(),
                timestamp: getCurrentTime(),
              },
              {
                type: "incoming",
                message: item.AiRes.replace("William:", "")
                  .replace("<END_OF_TURN>", "")
                  .trim(),
                timestamp: getCurrentTime(),
              },
            ];
          })
          .flat();
        setMessageArray(formattedMessages);
      } catch (error) {
        console.log("error::::", error);
      }
    };

    if (selectedInbox !== null) {
      getSingleChatHistory();
    } else {
      console.log("selectedInbox is null, skipping API call");
      setMessageArray([]);
    }
  }, [selectedInbox]);

  const [psychiatristChatSession, { data, isLoading }] =
    usePsychiatristChatSessionMutation();
  const [
    getDoctorsByDeptName,
    { data: getDoctorsByDeptNameData, isLoading: getDoctorsByDeptNameLoading },
  ] = useLazyGetDoctorsByDeptNameQuery();
  useEffect(() => {
    if (data) {
      setMessageArray((prev) => [
        ...prev,
        {
          type: "incoming",
          message: data?.data?.[0]?.generated_text,
          timestamp: getCurrentTime(),
        },
      ]);
      setIsChatEnded(data?.data?.is_chat || false);
      setSpecificChatHistory(data?.data?.[0].history);
    }
  }, [data]);

  useEffect(() => {
    scrollToBottom();
  }, [messageArray]);

  const scrollToBottom = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const getCurrentTime = () => {
    return moment().format("h:mm A");
  };
  const sendMessageHandler = async () => {
    // debugger;
    try {
      if (!inputStr.trim()) return;
      setMessageArray((prev) => [
        ...prev,
        {
          type: "outgoing",
          message: inputStr,
          timestamp: getCurrentTime(),
        },
      ]);
      setInputStr("");
      const response = await psychiatristChatSession({
        user_query: inputStr,
        user_id: userID,
        session_id:
          selectedInbox !== null
            ? selectedInbox?.session_id
            : randomNo?.data?.[0]?.session_id,
      });
      // const res = await axios.post(
      //   `/psychiatrist_chat_session?user_query=${inputStr}&user_id=${userID}&session_id=${
      //     selectedInbox !== null
      //       ? selectedInbox?.session_id
      //       : randomNo?.data?.[0]?.session_id
      //   }`
      // );

      console.log("response:::::", response);
    } catch (error) {
      console.error("Error occurred while calling the API:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessageHandler();
    }
  };

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
  const history =
    "['User: have headache  <END_OF_TURN>', \"William: Hello, I am Dr. William, a Virtual Assistant Doctor. I'm here to help you with your headache. May I know your name, age, gender, and occupation, please? <END_OF_TURN>\", 'User: half side head pain <END_OF_TURN>', \"William: I understand you're experiencing pain on one side of your head. To assist you better, could you please tell me your name, age, gender, and what you do for a living? <END_OF_TURN>\"]";

  const handleShowDepartmentModal = () => {
    setShowDepartmentModal(true);
  };

  const handleConfirm = async () => {
    debugger;
    try {
      const response = await axios.get(
        `https://medical-aibe.xeventechnologies.com/get_doctor_field_and_department_from_history?history=${JSON.stringify(
          specificChatHistory
        )}`
      );
      console.log("response:::", response);
      if (response?.data?.succeeded === false) {
        dispatch(
          onFailure({
            message:
              response?.data?.message || "provide more details to end Chat",
          })
        );
        setShowDepartmentModal(false);
        return;
      }
      SetDept(response.data?.data?.[0]);
      if (response?.status === 200) {
        const resp = await getDoctorsByDeptName(
          response.data?.data?.[0]?.department
        );
        setDoctorList(resp?.data);
        const responses = await axios.post(
          `https://medical-aibe.xeventechnologies.com/generate_psychiatrist_chat_title?user_id=${userID}&session_id=${
            selectedInbox !== null
              ? selectedInbox.session_id
              : randomNo?.data?.[0]?.session_id
          }`
        );
        console.log("responses:::", responses);
        setRefreshTitle((pre) => !pre);
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  const getDoctorHandler = async () => {
    try {
      console.log("response:::", JSON.stringify(specificChatHistory));
      const response = await axios.get(
        `https://medical-aibe.xeventechnologies.com/get_doctor_field_and_department_from_history?history=${JSON.stringify(
          specificChatHistory
        )});`
      );
      console.log("response:::::", response);
      if (response?.data?.succeeded === false) {
        setErrorMessage(response?.data?.message);
        setShowDepartmentModal(false);
        return;
      }
      SetDept(response.data?.data?.[0]);
      if (response?.status === 200) {
        const resp = await getDoctorsByDeptName(
          response.data?.data?.[0]?.department
        );
        console.log("resp", resp);
        setDoctorList(resp?.data);
        setRefreshTitle((pre) => !pre);
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  return (
    <>
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
        <Box
          // sx={{ borderBottom: "1px solid #C3C3C3" }}
          p={2}
          alignItems="center"
          display="flex"
        >
          {screenWidth < 992 && (
            <ArrowBackIcon
              onClick={() => setShowMessanger(false)}
              sx={{ cursor: "pointer" }}
            />
          )}
          {isChatEnded === true ? (
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
                  mr: 2,
                  color: "white",
                  justifyContent: "end",
                }}
                cursor="pointer"
                onClick={() => {
                  setShowDoctors(true);
                  getDoctorHandler();
                }}
                // startIcon={<CommentsDisabledIcon />}
              >
                Recommended Doctors
              </StyledButton>
            </Box>
          ) : messageArray.length > 0 ? (
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
                  mr: 2,
                  color: "white",
                  justifyContent: "end",
                }}
                cursor="pointer"
                onClick={handleShowDepartmentModal}
                startIcon={<CommentsDisabledIcon />}
              >
                End Session
              </StyledButton>
            </Box>
          ) : (
            <></>
          )}
        </Box>
        {messageArray.length > 0 && (
          <ScrollableBox
            sx={{ flex: 1 }}
            p={2}
            backgroundColor="#fff"
            id="chatmodule"
            style={{ height: `calc(100vh - 349px)`, overflow: "auto" }}
          >
            {messageArray.map((item, index) => {
              return (
                <>
                  <Box
                    display="flex"
                    flexDirection={`${
                      item.type === "incoming" ? "row" : "row-reverse"
                    }`}
                    my={2}
                    key={index}
                  >
                    {item.type === "incoming" && (
                      <Avatar
                        {...stringAvatar("William")}
                        sx={{
                          bgcolor: "rgb(224, 40, 40)",
                          width: 50,
                          height: 50,
                          mr: 1,
                          p: "2px",
                          mt: "4px",
                        }}
                      />
                    )}
                    {item.type === "outgoing" && (
                      <Avatar
                        sx={{
                          bgcolor: "rgb(224, 40, 40)",
                          width: 40,
                          height: 40,
                          mr: 1,
                          ml: 1,
                          p: "6px",
                          mt: "6px",
                        }}
                      >
                        {session?.data?.user?.user?.name?.substring(0, 1) ||
                          "P"}
                      </Avatar>
                    )}
                    <Box>
                      <Box
                        width="fit-content"
                        bgcolor={`${
                          item.type === "incoming" ? "none" : "#E02828"
                        }`}
                        p={2}
                        m={`0px 0px 0px ${
                          item.type === "incoming" ? "0px" : "auto"
                        } `}
                        sx={{
                          textAlign: `${
                            item.type === "incoming" ? "left" : "right"
                          }`,
                          border: `1px solid ${
                            item.type === "incoming" ? "#E3E3E3" : "none"
                          }`,
                          borderRadius: ` ${
                            item.type === "incoming"
                              ? "20px 20px 20px 0px"
                              : "20px 20px 0px 20px"
                          }`,
                        }}
                      >
                        <MuiTypography
                          textAlign="start"
                          variant="subtitle1"
                          fontWeight="400"
                          color={`${
                            item.type === "incoming" ? "#000" : "#fff"
                          }`}
                        >
                          {item?.message}
                        </MuiTypography>
                      </Box>
                      <MuiTypography
                        variant="subtitle1"
                        fontWeight="400"
                        fontSize="12px"
                        color="#9C9C9C"
                        sx={{
                          pt: 1,
                          textAlign: `${
                            item.type === "incoming" ? "left" : "right"
                          }`,
                        }}
                      >
                        {item?.timestamp}
                      </MuiTypography>
                    </Box>
                  </Box>
                </>
              );
            })}
          </ScrollableBox>
        )}
        {messageArray.length <= 0 && (
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

        {isLoading && (
          <BeatLoader
            style={{ marginLeft: "70px" }}
            color="#000000"
            size="10px"
          />
        )}
        {isChatEnded === false ? (
          <Box sx={{ borderTop: "1px solid #C3C3C3" }} p={2}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box display="flex" alignItems="center" sx={{ flex: 1 }}></Box>
              <Box display="flex" alignItems="center" ml={1}>
                <Box sx={{ flex: 1 }}>
                  <InputField
                    id="outlined-adornment-password"
                    type={"text"}
                    placeholder="Type a message here…"
                    value={inputStr}
                    onChange={(e) => setInputStr(e.target.value)}
                    onKeyDown={handleKeyPress}
                    endAdornment={
                      <InputAdornment position="end">
                        <SendButton
                          aria-label="toggle password visibility"
                          edge="end"
                          sx={{
                            background: "rgb(224, 40, 40)",
                            marginRight: "2px",
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
            </Box>
          </Box>
        ) : null}
        {showDepartmentModal && (
          <DepartmentModal
            open={showDepartmentModal}
            handleClose={() => {
              SetDept(null);
              setDoctorList(null);
              // setMessageArray([]);
              // selectedInbox(null);
              setRefreshTitle((pre) => !pre);
              setShowDepartmentModal(false);
            }}
            title="Are you sure you want to end session?"
            onConfirm={handleConfirm}
            dept={dept}
            doctorList={doctorList?.data}
            getDoctorsByDeptNameLoading={getDoctorsByDeptNameLoading}
          />
        )}
        {showDoctors && (
          <SuggestedDepartmentsModal
            open={showDoctors}
            handleClose={() => {
              SetDept(null);
              setDoctorList(null);
              // setMessageArray([]);
              setRefreshTitle((pre) => !pre);
              setShowDoctors(false);
            }}
            errorMessage={errorMessage}
            onConfirm={handleConfirm}
            dept={dept}
            doctorList={doctorList?.data}
            getDoctorsByDeptNameLoading={getDoctorsByDeptNameLoading}
            chatSessionId={
              selectedInbox !== null
                ? selectedInbox.session_id
                : randomNo?.data?.[0]?.session_id
            }
          />
        )}
        <div ref={bottomRef} />
      </StyledUserChatContainer>
    </>
  );
}
