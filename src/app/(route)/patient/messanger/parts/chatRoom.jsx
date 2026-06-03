"use client";

import { Box } from "@/components";
import InputField from "@/components/core/Input";
import MuiTypography from "@/components/core/Typography";
import useScreenWidth from "@/hooks/useScreenWidth";
import { Avatar, IconButton, InputAdornment } from "@mui/material";
import styled from "styled-components";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VideoCalling from "./videoCalling";
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
import AttachmentIcon from "@mui/icons-material/Attachment";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import convertBase64 from "@/components/convertBase64";
import { useDispatch } from "react-redux";
import { onFailure } from "@/redux/features/apiStatusSlice";
import { useUploadMediaListMutation } from "@/redux/slices/userProfile";
import CloseIcon from "@mui/icons-material/Close";
import ImageModal from "@/components/webComponent/imageModal";

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
  console.log(
    "GetAllConversationDetailsData::::",
    GetAllConversationDetailsData
  );
  const screenWidth = useScreenWidth();
  const session = useSession();
  const [inputStr, setInputStr] = useState("");
  const [createChat] = useCreateChatMutation();
  const [trigger, setTrigger] = useState(false);
  const chatContainerRef = useRef(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const [mediaUploads, setMediaUploads] = useState([]);
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState("");

  const [
    uploadMediaList,
    { data: uploadMediaListData, isLoading: uploadMediaListLoading },
  ] = useUploadMediaListMutation();
  console.log("mediaUploads", mediaUploads);

  useEffect(() => {
    if (GetAllConversationDetailsData?.data) {
      setMessages(GetAllConversationDetailsData.data);
    }
  }, [GetAllConversationDetailsData]);
  // console.log("uploadedImages:::", uploadedImages);

  useEffect(() => {
    if (socket) {
      // debugger;
      socket.on("message", (data) => {
        data.toUserId = Number(data.toUserId);
        data.fromUserId = Number(data.fromUserId);
        setMessages((prevMessages) => [...prevMessages, data]);
        scrollToBottom();
      });

      return () => {
        socket.off("message");
      };
    }
  }, [socket, trigger]); // Make sure to include 'socket' as a dependency

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

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const sendMessageHandler = async () => {
    if (!inputStr.trim() && mediaUploads.length === 0) return;

    try {
      const payload = {
        message: inputStr,
        toUserId: selectedInbox?.userId,
        fromUserId: session?.data?.user?.user?.userId,
        inboxId: selectedInbox?.inboxId,
        patDocChatDocumentDTOs:
          mediaUploads?.map((c) => ({
            documentURL: c?.keyName || "",
            // documentURL: c?.baseUrl || "",
          })) || [],
      };
      const payloadToAppend = {
        message: inputStr,
        toUserId: selectedInbox?.userId,
        fromUserId: session?.data?.user?.user?.userId,
        inboxId: selectedInbox?.inboxId,
        documentUrlList: mediaUploads?.map((c) => c.keyName || "") || [],
        documentKeyList: mediaUploads?.map((c) => c.baseUrl || "") || [],
      };
      console.log("payload::::", payload);
      // return
      setInputStr("");
      await createChat(payload);
      const sendMessagePayload = {
        room: selectedInbox?.inboxId,
        message: inputStr,
        name: "chat",
        toUserId: `${selectedInbox?.userId}`,
        fromUserId: `${session?.data?.user?.user?.userId}`,
        documentKeyList: mediaUploads?.map((c) => c.baseUrl || "") || [],
      };
      setMessages((prevMessages) => [...prevMessages, payloadToAppend]);
      setMediaUploads([]);
      socket.emit("sendMessage", sendMessagePayload);
      setTrigger((pre) => !pre);
    } catch (error) {
      console.error("Error occurred while calling the API:", error);
    }
  };

  const handleChangeUpload = async (e) => {
    const files = Array.from(e.target.files);
    const newMediaArray = [];

    for (const file of files) {
      const lastIndexOfDot = file.name.lastIndexOf(".");
      const name = file.name.slice(0, lastIndexOfDot);
      const ext = file.name.slice(lastIndexOfDot + 1).toLowerCase();

      // Process the file and get the data
      const fileData = await processFile(file, name, ext);

      // Upload the processed file
      const response = await uploadMediaList([fileData]);
      const MAX_FILE_SIZE_MB = 15;
      // If the upload succeeds, add the file data to the media array
      if (response?.data?.succeeded) {
        const uploadedFileData = response.data.data[0];
        newMediaArray.push({
          fileName: name,
          baseUrl: uploadedFileData.baseUrl,
          ext,
          keyName: uploadedFileData.keyName,
        });
      } else {
        dispatch(
          onFailure({
            message: `Upload failed: The file "${file.name}"  exceeds the maximum allowed size of ${MAX_FILE_SIZE_MB} MB.`,
          })
        );
        console.error(
          `Upload failed: The file "${file.name}" exceeds the maximum allowed size of ${MAX_FILE_SIZE_MB} MB.`
        );
      }
    }

    // Update the state with the new media uploads, clearing any previous uploads
    setMediaUploads(newMediaArray);
  };

  const processFile = (file, name, ext) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const base64String = event.target.result.split(",")[1];

        const fileData = {
          fileName: name,
          base64address: base64String,
          extensions: ext,
          baseUrl: event.target.result, // Base64 data URL for rendering the file
        };

        resolve(fileData);
      };

      reader.onerror = (error) => {
        console.log("Error reading file:", error);
        reject(error);
      };

      reader.readAsDataURL(file);
    });
  };

  const onAttachmentClicked = (e) => {
    console.log("inputRef.current::::", inputRef);
    inputRef.current.click();
  };

  const removeFile = (index) => {
    setMediaUploads((prevMedia) => prevMedia.filter((_, i) => i !== index));
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

  const handlePdfClick = (url) => {
    debugger;
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank"; // Open in a new tab
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openImageModal = (src) => {
    setImageSrc(src);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setImageSrc("");
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
                {/* <Avatar
                  {...stringAvatar(selectedInbox?.name || "Augustina Midgett")}
                  sx={{
                    bgcolor: "rgb(224, 40, 40)",
                    width: 50,
                    height: 50,
                    mr: 1,
                  }}
                /> */}
                <Avatar
                  sx={{ height: "50px", width: "50px", mr: 1 }}
                  alt="Remy Sharp"
                  src={selectedInbox?.profilePicture}
                />

                <MuiTypography variant="body1" component="h6" fontWeight="500">
                  {selectedInbox?.name || "Augustina Midgett"}
                </MuiTypography>
              </Box>
            </Box>
          </Box>

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
                            : "none"
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
                              : "1px solid #E3E3E3",
                          borderRadius:
                            session?.data?.user?.user?.userId === item.toUserId
                              ? "20px 20px 20px 0px"
                              : "20px 20px 0px 20px",
                        }}
                      >
                        {item.documentKeyList?.length > 0 && (
                          <Box mt={2}>
                            {item.documentKeyList?.map((doc, docIndex) => (
                              <Box
                                sx={{ display: "flex", justifyContent: "end" }}
                                key={docIndex}
                                mt={1}
                              >
                                {doc?.includes(".pdf") ? (
                                  <Box
                                    className="container"
                                    sx={{
                                      background: "#fff",
                                      p: 1,
                                      borderRadius: "8px",
                                      border: "1px solid #E3E3E3",
                                      width: "295px",
                                      height: "150px",
                                      overflow: "hidden", // Hide overflow for the wrapper
                                      position: "relative",
                                      cursor: "pointer",
                                    }}
                                  >
                                    <iframe
                                      id={`theiframe-${docIndex}`}
                                      src={doc}
                                      title={`pdf-preview-${docIndex}`}
                                      style={{
                                        border: "none",
                                        overflow: "auto",
                                        overflowX: "hidden",
                                        width: "100%",
                                        height: "100%",
                                        zIndex: 999,
                                      }}
                                    />
                                    <div
                                      className="overlay"
                                      style={{
                                        top: 0,
                                        left: 0,
                                        width: "100%",
                                        height: "100%",
                                        position: "absolute",
                                        cursor: "pointer",
                                      }}
                                      onClick={() => handlePdfClick(doc)}
                                    />
                                  </Box>
                                ) : (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <img
                                      src={doc}
                                      alt={`preview-${docIndex}`}
                                      height={"100px"}
                                      style={{
                                        objectFit: "cover",
                                        cursor: "pointer",
                                      }}
                                      onClick={() => openImageModal(doc)}
                                    />
                                    <ImageModal
                                      open={modalOpen}
                                      onClose={closeModal}
                                      imageSrc={imageSrc}
                                    />
                                  </Box>
                                )}
                              </Box>
                            ))}
                          </Box>
                        )}
                        <MuiTypography
                          textAlign="start"
                          variant="subtitle1"
                          fontWeight="400"
                          color={
                            session?.data?.user?.user?.userId === item.toUserId
                              ? "#000"
                              : "#000"
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
          {uploadMediaListLoading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "start",
                width: "100%",
                ml: 3,
                mb: 2,
              }}
            >
              <Loader1 />
            </Box>
          ) : (
            <Box
              sx={{
                overflowX: "auto",
                whiteSpace: "nowrap",
                width: "30em", // or adjust as needed
                ml: 2,
              }}
            >
              <Box sx={{ display: "inline-flex", gap: 2 }}>
                {mediaUploads.length > 0 &&
                  mediaUploads.map((mediaData, index) => (
                    <Box
                      key={index}
                      sx={{
                        position: "relative",
                        background: "#fff",
                        p: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minWidth: mediaData?.ext === "pdf" ? "295px" : "130px", // Use minWidth instead of width
                        maxWidth: mediaData?.ext === "pdf" ? "295px" : "130px", // Add maxWidth to enforce fixed size
                        height: "130px",
                        borderRadius: "4px", // Optional: for rounded corners
                        overflow: "hidden",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.2)", // Optional: for a subtle shadow
                      }}
                    >
                      <IconButton
                        sx={{
                          position: "absolute",
                          top: 0, // Adjusted position for smaller size
                          right: 0, // Adjusted position for smaller size
                          zIndex: 10,
                          background: "#E02828", // Red background color
                          color: "white", // White cross color
                          width: "18px", // Smaller size
                          height: "18px", // Smaller size
                          "&:hover": {
                            background: "darkred", // Darker red on hover
                          },
                        }}
                        onClick={() => removeFile(index)}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                      {mediaData?.ext === "pdf" ? (
                        <Box
                          sx={{
                            width: "295px",
                            height: "150px",
                            overflow: "hidden", // Hide overflow for the wrapper
                            position: "relative",
                          }}
                        >
                          <iframe
                            src={mediaData?.baseUrl || ""}
                            title={`pdf-preview-${index}`}
                            style={{
                              border: "none",
                              width: "295px",
                              height: "150px",
                              marginTop: "10px",
                              overflow: "auto", // Allow scrolling within the iframe
                              overflowX: "hidden", // Hide horizontal scrollbar
                            }}
                            className="custom-iframe"
                          />
                        </Box>
                      ) : (
                        <img
                          src={mediaData?.baseUrl || ""}
                          alt={`preview-${index}`}
                          style={{
                            width: "100%",
                            height: "100%",
                          }}
                        />
                      )}
                    </Box>
                  ))}
              </Box>
            </Box>
          )}

          <Box sx={{ borderTop: "1px solid #C3C3C3" }} p={2}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box display="flex" alignItems="center" sx={{ flex: 1 }}>
                <AttachFileIcon
                  size="small"
                  type="file"
                  onClick={(e) => onAttachmentClicked(e)}
                  sx={{
                    cursor: "pointer",
                    color: "#9C9C9C",
                    fontSize: "30px",
                  }}
                />
                <div>
                  <input
                    ref={inputRef}
                    onChange={(e) => handleChangeUpload(e)}
                    type="file"
                    hidden
                    multiple
                    accept="image/* ,application/pdf"

                    // disabled={chatArray?.length > 2 ? false : true}
                  />
                </div>
              </Box>

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
                            mr: "5px",
                            " &:hover": {
                              background: "#E02828",
                            },
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
          </Box>
        </StyledUserChatContainer>
      ) : null}
    </>
  );
}
