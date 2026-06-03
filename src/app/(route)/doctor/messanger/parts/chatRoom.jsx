"use client";

import { Box } from "@/components";
import InputField from "@/components/core/Input";
import MuiTypography from "@/components/core/Typography";
import useScreenWidth from "@/hooks/useScreenWidth";
import { Avatar, IconButton, InputAdornment } from "@mui/material";
import styled from "styled-components";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VideoCalling from "./videoCalling";
import { useEffect, useState } from "react";
import { BsFillSendFill } from "react-icons/bs";
import {
  useCreateChatMutation,
  useLazyGetAllConversationDetailsQuery,
} from "@/redux/slices/socketChat";
import { useSession } from "next-auth/react";
import moment from "moment";
import { stringAvatar } from "@/lib/utils";

const StyledUserChatContainer = styled(Box)`
  display: ${(props) =>
    props.screenWidth < 992
      ? props.showMessanger === false
        ? "none"
        : "flex"
      : "flex"};
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
}) {
  const screenWidth = useScreenWidth();
  const session = useSession();
  const [triggerApi, setTriggerApi] = useState(false);
  const [inputStr, setInputStr] = useState("");
  const [
    GetAllConversationDetails,
    {
      data: GetAllConversationDetailsData,
      isLoading: GetAllConversationDetailsLoading,
    },
  ] = useLazyGetAllConversationDetailsQuery({
    inboxId: 1,
  });
  const [messages, setMessages] = useState(
    GetAllConversationDetailsData?.data || []
  );

  useEffect(() => {
    socket.on("roomMessage", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    socket.on("notification", (data) => {
      alert(`Notification: ${data}`);
    });

    return () => {
      socket.off("roomMessage");
      socket.off("notification");
    };
  }, []);

  useEffect(() => {
    async function GetAllConversationDetailsHandler() {
      const response = await GetAllConversationDetails({ inboxId: 1 });
    }
    if (session) GetAllConversationDetailsHandler();
  }, [session, triggerApi]);

  const [createChat, { data, isLoading }] = useCreateChatMutation();
  const sendMessageHandler = async () => {
    try {
      if (!inputStr.trim()) return;
      setInputStr("");
      const payload = {
        message: inputStr,
        toUserId: selectedInbox?.userId || 46,
        fromUserId: session?.data?.user?.user?.userId,
        inboxId: selectedInbox?.inboxId || 1,
      };
      console.log("payload:::", payload);
      await createChat(payload);
      socket.emit("roomMessage", {
        room: "h4",
        message: inputStr,
        name: "h1",
        toUserId: selectedInbox?.userId || 46,
        fromUserId: session?.data?.user?.user?.userId,
      });
      setTriggerApi(!triggerApi);
    } catch (error) {
      console.error("Error occurred while calling the API:", error);
    }
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessageHandler();
    }
  };

  const [videoView, setVideoView] = useState(false);

  const INPUT_FIELD_PROPS_MESSAGE = {
    label: "",
    fullWidth: true,
    variant: "standard",
  };
  const Call_ICON_PROPS = {
    display: "flex",
    padding: "5px",
    borderRadius: "50%",
  };
  const INPUT_FIELD_STYLES_MESSAGE = {
    sx: {
      width: "100%",
      height: "55px",
      //   padding: 0,
      borderRadius: "50px",

      "& fieldset": { border: "1px solid #D2D2D2" },
    },
  };

  // const CHAT_DATA = [
  //   {
  //     type: "incoming",
  //     message:
  //       "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lacus hendrerit ultrices fames nunc sit nulla arcu est est. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lacus hendrerit ultrices fames nunc sit nulla arcu est est. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lacus hendrerit ultrices fames nunc sit nulla arcu est est. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lacus hendrerit ultrices fames nunc sit nulla arcu est est. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lacus hendrerit ultrices fames nunc sit nulla arcu est est. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lacus hendrerit ultrices fames nunc sit nulla arcu est est.",
  //   },
  //   {
  //     type: "incoming",
  //     message:
  //       "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lacus hendrerit ultrices fames nunc sit nulla arcu est est. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lacus hendrerit ultrices fames nunc sit nulla arcu est est. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lacus hendrerit ultrices fames nunc sit nulla arcu est est. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lacus hendrerit ultrices fames nunc sit nulla arcu est est. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lacus hendrerit ultrices fames nunc sit nulla arcu est est. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lacus hendrerit ultrices fames nunc sit nulla arcu est est.",
  //   },
  //   {
  //     type: "incoming",
  //     message:
  //       "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lacus hendrerit ultrices fames nunc sit nulla arcu est est. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lacus hendrerit ultrices fames nunc sit nulla arcu est est. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lacus hendrerit ultrices fames nunc sit nulla arcu est est. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lacus hendrerit ultrices fames nunc sit nulla arcu est est. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lacus hendrerit ultrices fames nunc sit nulla arcu est est. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lacus hendrerit ultrices fames nunc sit nulla arcu est est.",
  //   },
  //   {
  //     type: "outgoing",
  //     message: "dummy lorem ipsum ",
  //   },

  //   {
  //     type: "outgoing",
  //     message:
  //       "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lacus hendrerit ultrices fames nunc sit nulla arcu est est. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lacus hendrerit ultrices fames nunc sit nulla arcu est est. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lacus hendrerit ultrices fames nunc sit nulla arcu est est. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lacus hendrerit ultrices fames nunc sit nulla arcu est est. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lacus hendrerit ultrices fames nunc sit nulla arcu est est. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lacus hendrerit ultrices fames nunc sit nulla arcu est est.",
  //   },
  // ];
  return (
    <>
      {selectedInbox ? (
        <StyledUserChatContainer
          screenWidth={screenWidth}
          showMessanger={showMessanger}
          sx={{
            borderLeft: `${
              screenWidth < 992 && !showMessanger ? "1px solid #C3C3C3" : "none"
            }`,
          }}
          display="flex"
          justifyContent="space-between"
          flexDirection="column"
        >
          <Box
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
                  {...stringAvatar(selectedInbox?.name || " Augustina Midgett")}
                  sx={{
                    bgcolor: "rgb(224, 40, 40)",
                    width: 50,
                    height: 50,
                    mr: 1,
                  }}
                />
                <MuiTypography variant="body1" component="h6" fontWeight="500">
                  {selectedInbox?.name || " Augustina Midgett"}
                </MuiTypography>
              </Box>
              {/* <Box display="flex" alignItems="center" sx={{ flex: 1 }}>
         <Box
           sx={{ mr: 1 }}
           border={videoView === false ? "1px solid #FCE9E9" : "none"}
           {...Call_ICON_PROPS}
         >
           <Box
             border={videoView === false ? "1px solid #F2A6A6" : "none"}
             {...Call_ICON_PROPS}
           >
             <CallIcon
               onClick={() => setVideoView(false)}
               sx={{
                 cursor: "pointer",
                 color: "rgb(224, 40, 40)",
                 fontSize: "25px",
                 border: !videoView ? "1px solid #E02828" : "none",
                 padding: "5px",
                 borderRadius: "50%",
               }}
             />
           </Box>
         </Box>
         <Box
           sx={{ mr: 1 }}
           border={videoView === true ? "1px solid #FCE9E9" : "none"}
           {...Call_ICON_PROPS}
         >
           <Box
             border={videoView === true ? "1px solid #F2A6A6" : "none"}
             {...Call_ICON_PROPS}
           >
             <VideocamIcon
               onClick={() => setVideoView(true)}
               sx={{
                 cursor: "pointer",
                 color: "rgb(224, 40, 40)",
                 border: videoView ? "1px solid #E02828" : "none",
                 borderRadius: "50%",
                 padding: "5px",
                 fontSize: "30px",
               }}
             />
           </Box>
         </Box>
       </Box> */}
            </Box>
          </Box>

          <ScrollableBox
            sx={{ flex: 1 }}
            p={2}
            backgroundColor="#fff"
            id="chatmodule"
            style={{ height: `calc(100vh - 349px)`, overflow: "auto" }}
          >
            {videoView ? (
              <VideoCalling />
            ) : (
              <Box>
                {/* <MuiTypography
             width="90px"
             margin="5px auto"
             display="flex"
             justifyContent="center"
             color="#999999"
             border="1px solid #FFFFFF"
             borderRadius="20px"
             sx={{ boxShadow: "0px 0px 19px 0px #0000001A" }}
           >
             Today
           </MuiTypography> */}
                {/* 
                {GetAllConversationDetailsData?.data?.map((item, index) => {
                  return (
                    <Box display="flex" my={2} key={index}>
                      {session?.data?.user?.user?.userId === item.toUserId && (
                        <Avatar
                          {...stringAvatar("patientName")}
                          sx={{
                            bgcolor: "rgb(224, 40, 40)",
                            width: 50,
                            height: 50,
                            mr: 1,
                          }}
                        />
                      )}

                      <Box>
                        <Box
                          width="fit-content"
                          bgcolor={`${
                            session?.data?.user?.user?.userId === item.toUserId
                              ? "none"
                              : "#E02828"
                          }`}
                          p={2}
                          m={`0px 0px 0px ${
                            session?.data?.user?.user?.userId === item.toUserId
                              ? "0px"
                              : "auto"
                          } `}
                          sx={{
                            textAlign: `${
                              session?.data?.user?.user?.userId ===
                              item.toUserId
                                ? "left"
                                : "right"
                            }`,
                            border: `1px solid ${
                              session?.data?.user?.user?.userId ===
                              item.toUserId
                                ? "#E3E3E3"
                                : "none"
                            }`,
                            borderRadius: ` ${
                              session?.data?.user?.user?.userId ===
                              item.toUserId
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
                              session?.data?.user?.user?.userId ===
                              item.toUserId
                                ? "#000"
                                : "#fff"
                            }`}
                          >
                            {socketData ? socketData?.message : item?.message}
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
                              session?.data?.user?.user?.userId ===
                              item.toUserId
                                ? "left"
                                : "right"
                            }`,
                          }}
                        >
                          {moment.utc(item.createdDate).local().format("LT")}
                        </MuiTypography>
                      </Box>
                    </Box>
                  );
                })} */}
                {messages?.map((item, index) => {
                  // console.log("messages====>>>", messages);
                  return (
                    <Box display="flex" my={2} key={index}>
                      {session?.data?.user?.user?.userId === item.toUserId && (
                        <Avatar
                          {...stringAvatar("patientName")}
                          sx={{
                            bgcolor: "rgb(224, 40, 40)",
                            width: 50,
                            height: 50,
                            mr: 1,
                          }}
                        />
                      )}

                      <Box>
                        <Box
                          width="fit-content"
                          bgcolor={`${
                            session?.data?.user?.user?.userId === item.toUserId
                              ? "none"
                              : "#E02828"
                          }`}
                          p={2}
                          m={`0px 0px 0px ${
                            session?.data?.user?.user?.userId === item.toUserId
                              ? "0px"
                              : "auto"
                          } `}
                          sx={{
                            textAlign: `${
                              session?.data?.user?.user?.userId ===
                              item.toUserId
                                ? "left"
                                : "right"
                            }`,
                            border: `1px solid ${
                              session?.data?.user?.user?.userId ===
                              item.toUserId
                                ? "#E3E3E3"
                                : "none"
                            }`,
                            borderRadius: ` ${
                              session?.data?.user?.user?.userId ===
                              item.toUserId
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
                              session?.data?.user?.user?.userId ===
                              item.toUserId
                                ? "#000"
                                : "#fff"
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
                              session?.data?.user?.user?.userId ===
                              item.toUserId
                                ? "left"
                                : "right"
                            }`,
                          }}
                        >
                          {moment.utc(item.createdDate).local().format("LT")}
                        </MuiTypography>
                      </Box>
                    </Box>
                  );
                })}
                {/* <ul>
                  {messages?.map((msg, index) => {
                    console.log("JsxData::::", msg);
                    return <li key={index}>{msg?.message || ""}</li>;
                  })}
                </ul> */}
              </Box>
            )}
          </ScrollableBox>

          <Box sx={{ borderTop: "1px solid #C3C3C3" }} p={2}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              {/* <Box display="flex" alignItems="center" sx={{ flex: 1 }}>
         <SentimentSatisfiedOutlinedIcon
           onClick={() => setShowMessanger(false)}
           sx={{
             cursor: "pointer",
             color: "#9C9C9C",
             fontSize: "25px",
             mr: 1,
           }}
         />
         <AttachmentIcon
           onClick={() => setShowMessanger(false)}
           sx={{
             cursor: "pointer",
             color: "#9C9C9C",
             fontSize: "30px",
           }}
         />
       </Box> */}
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
                {/* <MicIcon
                 sx={{
                   cursor: "pointer",
                   color: "rgb(224, 40, 40)",
                   fontSize: "30px",
                   ml: 1,
                 }}
               /> */}
              </Box>
            </Box>
          </Box>
        </StyledUserChatContainer>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
            textAlign: "center",
            padding: 2,
            backgroundColor: "#f9f9f9",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Box mb={2}>
            <img
              src="/images/nochat.png"
              alt="No chat"
              width={"80px"}
              height={"80px"}
            />
          </Box>
          <Box>
            <p style={{ fontSize: "18px", fontWeight: "500", color: "#555" }}>
              No Chat to show
            </p>
          </Box>
        </Box>
      )}
    </>
  );
}
