"use client";

import { Box } from "@/components";
import InputField from "@/components/core/Input";
import MuiTypography from "@/components/core/Typography";
import { Avatar, IconButton, InputAdornment } from "@mui/material";
import styled from "styled-components";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import useScreenWidth from "@/hooks/useScreenWidth";
import { useEffect, useRef, useState } from "react";
import { BsFillSendFill } from "react-icons/bs";
import {
  useCreateChatMutation,
  useLazyGetAllConversationDetailsQuery,
} from "@/redux/slices/socketChat";
import { useSession } from "next-auth/react";
import moment from "moment";
import { stringAvatar } from "@/lib/utils";
import { BeatLoader } from "react-spinners";
import { Loader1 } from "@/components/core/Loader/Loader";

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

export default function ChatRoom({
  showMessanger,
  setShowMessanger,
  selectedInbox,
  socket,
  GetAllConversationDetailsData,
  GetAllConversationDetailsLoading,
  messages,
  setMessages,
}) {
  const screenWidth = useScreenWidth();
  const session = useSession();
  const [inputStr, setInputStr] = useState("");
  const [createChat] = useCreateChatMutation();
  const [trigger, setTrigger] = useState(false);

  const chatContainerRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (GetAllConversationDetailsData?.data) {
      setMessages(GetAllConversationDetailsData.data);
    }
  }, [GetAllConversationDetailsData]);

  useEffect(() => {
    socket.on("roomMessage", (data) => {
      // debugger
      data.toUserId = Number(data.toUserId);
      data.fromUserId = Number(data.fromUserId);
      setMessages((prevMessages) => [...prevMessages, data]);
      scrollToBottom();
    });

    socket.on("notification", (data) => {
      alert(`Notification: ${data}`);
    });

    return () => {
      socket.off("roomMessage");
      socket.off("notification");
    };
  }, [socket, messages]);

  const joinRoom = () => {
    const payload = {
      email: `${session?.data?.user?.user?.userId}`,
    };
    if (socket) {
      socket.emit("join", payload);
      console.log("Room joined on patient Side");
    }
  };
  useEffect(() => {
    if (selectedInbox) joinRoom();
  }, [socket, selectedInbox, trigger]);

  // useEffect(() => {
  //   if (session) {
  //     GetAllConversationDetails({ inboxId: selectedInbox?.inboxId });
  //   }
  // }, [session, selectedInbox, GetAllConversationDetails]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const sendMessageHandler = async () => {
    if (!inputStr.trim()) return;

    try {
      const payload = {
        message: inputStr,
        toUserId: selectedInbox?.userId,
        fromUserId: session?.data?.user?.user?.userId,
        inboxId: selectedInbox?.inboxId,
      };
      setInputStr("");
      await createChat(payload);
      setMessages((prevMessages) => [...prevMessages, payload]);
      socket.emit("roomMessage", {
        room: selectedInbox?.inboxId,
        message: inputStr,
        name: "chat",
        toUserId: selectedInbox?.userId,
        fromUserId: session?.data?.user?.user?.userId,
      });
      setTrigger((pre) => !pre);
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

  return (
    <>
      {selectedInbox ? (
        <StyledUserChatContainer
          screenWidth={screenWidth}
          showMessanger={showMessanger}
          sx={{
            borderLeft:
              screenWidth < 992 && !showMessanger
                ? "1px solid #C3C3C3"
                : "none",
          }}
          display="flex"
          justifyContent="space-between"
          flexDirection="column"
        >
          {/* <Box
            sx={{ borderBottom: "1px solid #C3C3C3" }}
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
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              sx={{ ml: 1 }}
            >
              <Box display="flex" alignItems="center">
                <Avatar
                  {...stringAvatar(selectedInbox?.name || "Augustina Midgett")}
                  sx={{
                    bgcolor: "rgb(224, 40, 40)",
                    width: 50,
                    height: 50,
                    mr: 1,
                  }}
                />
                <MuiTypography variant="body1" component="h6" fontWeight="500">
                  {selectedInbox?.name || "Augustina Midgett"}
                </MuiTypography>
              </Box>
            </Box>
          </Box> */}

          <ScrollableBox
            sx={{ flex: 1 }}
            p={2}
            backgroundColor="#fff"
            id="chatmodule"
            ref={chatContainerRef}
            style={{ height: `calc(100vh - 349px)` }}
          >
            <Box>
              {GetAllConversationDetailsLoading ? (
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Loader1 />
                </Box>
              ) : messages.length === 0 ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    // alignItems: "end",
                    width: "100%",
                    height: "80vh",
                    textAlign: "center",
                    // padding: 2,
                    backgroundColor: "#f9f9f9",
                    // borderRadius: "8px",
                    // boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <Box>
                    <img
                      src="/images/nochat.png"
                      alt="No chat"
                      width={"80px"}
                      height={"80px"}
                    />
                  </Box>
                  <Box>
                    <p
                      style={{
                        fontSize: "18px",
                        fontWeight: "500",
                        color: "#555",
                      }}
                    >
                      No Chat to show
                    </p>
                  </Box>
                </Box>
              ) : (
                messages.map((item, index) => (
                  <Box display="flex" my={2} key={index}>
                    <Box>
                      <Box
                        width="fit-content"
                        bgcolor={
                          session?.data?.user?.user?.userId === item.toUserId
                            ? "none"
                            : "#E02828"
                        }
                        p={2}
                        m={`0px 0px 0px ${
                          session?.data?.user?.user?.userId === item.toUserId
                            ? "0px"
                            : "auto"
                        }`}
                        sx={{
                          textAlign:
                            session?.data?.user?.user?.userId === item.toUserId
                              ? "left"
                              : "right",
                          border:
                            session?.data?.user?.user?.userId === item.toUserId
                              ? "1px solid #E3E3E3"
                              : "none",
                          borderRadius:
                            session?.data?.user?.user?.userId === item.toUserId
                              ? "20px 20px 20px 0px"
                              : "20px 20px 0px 20px",
                        }}
                      >
                        <MuiTypography
                          textAlign="start"
                          variant="subtitle1"
                          fontWeight="400"
                          color={
                            session?.data?.user?.user?.userId === item.toUserId
                              ? "#000"
                              : "#fff"
                          }
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
                          textAlign:
                            session?.data?.user?.user?.userId === item.toUserId
                              ? "left"
                              : "right",
                        }}
                      >
                        {moment.utc(item.createdDate).local().format("LT")}
                      </MuiTypography>
                    </Box>
                  </Box>
                ))
              )}
              <div ref={bottomRef} />
            </Box>
          </ScrollableBox>

          {/* <Box sx={{ borderTop: "1px solid #C3C3C3" }} p={2}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              {GetAllConversationDetailsLoading && (
                <BeatLoader
                  style={{ marginLeft: "70px" }}
                  color="#000000"
                  size="10px"
                />
              )}
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
                            borderRadius: "50%",
                            color: "#fff",
                            height: "40px",
                            width: "40px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          onClick={sendMessageHandler}
                        >
                          <BsFillSendFill />
                        </SendButton>
                      </InputAdornment>
                    }
                    {...INPUT_FIELD_PROPS_MESSAGE}
                    {...INPUT_FIELD_STYLES_MESSAGE}
                  />
                </Box>
              </Box>
            </Box>
          </Box> */}
        </StyledUserChatContainer>
      ) : null}
    </>
  );
}
