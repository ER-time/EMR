import React, { useEffect, useRef, useState } from "react";
import { BiSend } from "react-icons/bi";
import {
  IMAGES,
  Loader1,
  LoaderCenter,
  convertBase64,
  getCountryTimeZone,
} from "../../../assets";
import { WEB_SOCKET_URL } from "../../../config";
import io from "socket.io-client";
import { useAuth } from "../../../Navigation/Auth/ProvideAuth";
import { useDispatch, useSelector } from "react-redux";
import {
  chatCreateAction,
  getAllConversationDetailsAction,
  getAllInboxesAction,
} from "../../../app/features/doctor/chatSocket/chatSocket.slice";
import { MdAttachFile } from "react-icons/md";
import AWSImageUpload from "../../../app/features/AWSStorage/AWSupload.services";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { Modal } from "react-bootstrap";

const moment = require("moment-timezone");

export default function ChatBox(props) {
  console.log("propskadaata", props);

  let auth = useAuth();
  let dispatch = useDispatch();

  // const chatContainerRef = useRef(null);
  const [myMsg, setMyMsg] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [zoomedImageUrl, setZoomedImageUrl] = useState(null);

  // const messageInputRef = useRef(null);

  const chatContainerRef = useRef(null);

  useEffect(() => {
    chatContainerRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages]);

  // useEffect(() => {
  //   chatContainerRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [props]);

  useEffect(() => {
    dispatch(getAllInboxesAction());
    let finalData = {
      inboxId: props?.SlotListingData?.inboxId,
    };
    dispatch(getAllConversationDetailsAction(finalData));
  }, [dispatch, props]);

  let { getAllInboxes, getAllConversationDetails, isSuccess } = useSelector(
    (state) => state.chatSocket
  );
  useEffect(() => {
    if (getAllConversationDetails) {
      setMessages([...getAllConversationDetails].reverse());
    }
  }, [getAllConversationDetails]);

  const [socket, setSocket] = useState(null);

  console.log("hellochatAppointmentProps", props);

  useEffect(() => {
    const newSocket = io(WEB_SOCKET_URL);
    setSocket(newSocket);

    // Clean up the socket connection on unmount
    // return () => newSocket.close();
  }, []);
  const userId = auth?.intely_health_user?.userId;
  useEffect(() => {
    socket?.on("connect", () => {
      console.log("signal1", socket?.connected);
    });
    socket?.emit("connectToUserRoom", { userId: userId }, () => {
      console.log("signal2", socket?.connected);
      // setAgainCheckStatus(true);
    });
    if (socket?.connected === false) {
      socket?.on("reconnect", () => {
        console.log("reconnect", socket?.connected);
      });
    }
    if (socket?.connected === true) {
      console.log("refttytfconnect", socket?.connected);
    }
  }, [userId, props, socket]);

  useEffect(() => {
    if (socket?.connected === true) {
      socket?.on("messageData", (data) => {
        if (data?.data) {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              fromUserId: data?.data?.userIds?.[0]?.id,
              message: data?.data?.message,
              createdDate: "",
              attachedURL: "",
            },
          ]);
          let finalData = {
            inboxId: props?.SlotListingData?.inboxId,
          };
          dispatch(getAllConversationDetailsAction(finalData));
        }
        console.log("data", data);
      });
    }
  }, [socket, messages, props]);
  useEffect(() => {
    setMessages(getAllConversationDetails);
  }, [getAllConversationDetails]);

  const sendMsg = (e) => {
    if (myMsg || imageUrl) {
      if (socket) {
        let data = {
          message: myMsg,
          toUserId:
            auth?.intely_health_user?.roleId === 3
              ? props?.SlotListingData?.doctorId
              : props?.SlotListingData?.patientId,
          fromUserId: auth?.intely_health_user?.userId,
          attachedURL: imageUrl?.keyName,
          // attachedFileURL: imageUrl.map((item) => ({
          //   attachedFileURL: item.keyName,
          // })),
          inboxId: props?.SlotListingData?.inboxId,
        };
        socket?.emit("sendMessage", {
          userIds: [
            {
              id:
                auth?.intely_health_user?.roleId === 3
                  ? props?.SlotListingData?.doctorId
                  : props?.SlotListingData?.patientId,
            },
          ],
          // data: JSON.stringify(data),
          message: myMsg,
          attachedURL: imageUrl?.keyName || "",
          // attachedURL: imageUrl.map((item) => ({
          //   attachedFileURL: item.keyName,
          // })),
          type: "inteli_health",
          // uuid: v4(),
        });
        // console.log("selectedUser", data);
        dispatch(chatCreateAction({ data, moveToNext }));

        setMyMsg("");
      }
    } else {
    }
  };

  function moveToNext() {
    let finalData = {
      inboxId: props?.SlotListingData?.inboxId,
    };
    dispatch(getAllConversationDetailsAction(finalData));
    setImageUrl("");
    // messageInputRef.current.focus();
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  // const chatWindowRef = useRef(null);

  // const scrollToBottom = () => {
  //   const chatWindow = chatWindowRef.current;
  //   if (chatWindow) {
  //     chatWindow.scrollTo(0, chatWindow.scrollHeight);
  //     const scroller = document.querySelector("#chatmodule");
  //     scroller?.scroll(0, 20000);
  //   }
  // };

  // useEffect(() => {
  //   // Scroll to the bottom of the chat container
  //   scrollToBottom();
  // }, [
  //   getAllConversationDetails,
  //   /* Add any dependencies that should trigger a scroll to the bottom */
  // ]);

  // const scrollToBottom = () => {
  //   if (chatContainerRef.current) {
  //     chatContainerRef.current.scrollTop =
  //       chatContainerRef.current.scrollHeight;
  //   }
  // };
  // useEffect(() => {
  //   if (getAllConversationDetails) {
  //     // scrollToBottom();
  //   }
  // }, [getAllConversationDetails]);

  // useEffect(() => {
  //   chatContainerRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [getAllConversationDetails, props?.SlotListingData, props?.chatContainerRef]);

  const handleChangeUpload = async (e) => {
    let file = e.target.files[0];
    if (file) {
      const lastIndexOfDot = file.name.lastIndexOf(".");
      const name = file.name.slice(0, lastIndexOfDot);
      const ext = file.name.slice(lastIndexOfDot + 1, file.name.length);
      // convertBase64(file, (url) => {
      convertBase64(file).then((url) => {
        setLoading(true);
        const fileData = {
          fileName: name,
          base64address: url,
          extensions: `${ext}`,
        };
        AWSImageUpload(fileData).then((response) => {
          if (response?.httpStatusCode === 200) {
            // setImageUrl(response?.data);
            // setImageUrl([...imageUrl, response?.data]);
            setImageUrl(response?.data);
            setLoading(false);
          } else {
            // notification.error({
            //   message: response?.message,
            // });
          }
        });
      });
    }
  };

  const removeImage = () => {
    setImageUrl(null);
  };

  const timeZone = getCountryTimeZone();

  return (
    <>
      <div className="">
        <div className=" chat-parent-class video-chat-parent  pt-2">
          <div className="d-flex justify-content-between align-items-center mx-3 ">
            <span className="user-img profile-image mt-0 d-flex align-items-center ">
              {getAllInboxes
                .filter(
                  (item) => item.inboxId === props.SlotListingData.inboxID
                )
                .slice(0, 1) // Only take the first item from the filtered array
                .map((item) => (
                  <React.Fragment key={item.id}>
                    <img
                      className="rounded-circle"
                      src={item?.profilePicture || IMAGES.PROFILE}
                      width="31"
                      alt="Ryan Taylor"
                    />
                    <span>
                      <p className="patient-view-name mb-0">{item?.name}</p>
                    </span>
                  </React.Fragment>
                ))}
            </span>
          </div>
        </div>

        <div
          // className="height_adjust_chat parent-class-for-video-chat"
          // className="card-height-style parent-class-for-video-chat"
          className={`parent-class-for-video-chat ${
            imageUrl ? "card-height-style-image" : "card-height-style"
          }`}
          id="chatmodule"
          ref={chatContainerRef}
        >
          {isSuccess === true ? (
            <>
              {messages.length === 0 ? (
                <p className="table-no-record-style">No Record Found</p>
              ) : (
                <>
                  {messages.map((item, index) => {
                    const isFromDoctor =
                      item.fromUserId !== auth?.intely_health_user?.userId;
                    return (
                      <div
                        key={index}
                        className={`msg ${
                          isFromDoctor ? "left-msg" : "right-msg"
                        }`}
                      >
                        <div className="msg-image">
                          {item.attachedfileURL && (
                            <img
                              src={item.attachedfileURL}
                              className="email-attached-file ms-2 cursor"
                              alt="img"
                              onClick={() =>
                                setZoomedImageUrl(item?.attachedfileURL)
                              }
                            />
                          )}
                          {item.message === "" ? (
                            <></>
                          ) : (
                            <div className="msg-bubble mt-0">
                              <div className="msg-info">
                                <div className="msg-info-name">
                                  {item.message}
                                </div>
                                <div className="msg-info-time">
                                  {/* {item.createdDate.slice(-8, -3)} */}
                                  {moment
                                    .utc(item?.createdDate)
                                    .tz(timeZone)
                                    .format("hh:mm A")}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  <div ref={chatContainerRef} />
                </>
              )}
              {zoomedImageUrl && (
                <ImageModal
                  imageUrl={zoomedImageUrl}
                  onClose={() => setZoomedImageUrl(null)}
                  size="lg"
                />
              )}
            </>
          ) : (
            <Loader1 />
          )}
        </div>

        {imageUrl ? (
          <>
            <div className="image-style-for-chat">
              <div
                className="cursor-pointer preview-parent"
                // onClick={() => window.open(imageUrl?.baseUrl, "_blank")}
              >
                <span className="preview-overlay" />

                {/* {imageUrl?.map((item, index) => {
                  return ( */}
                <>
                  <div className="">
                    <img
                      src={imageUrl?.baseUrl}
                      alt="img"
                      className="image-style-converstion"
                    />
                    <div
                      className="close-img-button"
                      onClick={() => removeImage()}
                    >
                      <AiOutlineCloseCircle />
                    </div>
                  </div>
                </>
                {/* );
                })} */}
              </div>
            </div>
          </>
        ) : (
          ""
        )}
        {/* {imageUrl && (
          <>
            {imageUrl.map((item, index) => {
              return (
                <>
                  <div className="" key={index}>
                    <img
                      src={item?.baseUrl}
                      alt="img"
                      className="image-style-converstion"
                    />
                    <div
                      className="close-img-button"
                      onClick={() => removeImage(index)}
                    >
                      <AiOutlineCloseCircle />
                    </div>
                  </div>
                </>
              );
            })}
          </>
        )} */}

        <form
          className="msger-inputarea"
          onSubmit={(e) => {
            e.preventDefault(); // Prevent form submission
            sendMsg(); // Call the sendMessage function when Enter is pressed
          }}
        >
          <input
            type="text"
            className="msger-input"
            value={myMsg}
            onChange={(e) => {
              const inputValue = e.target.value;
              if (inputValue.length <= 500) {
                setMyMsg(inputValue);
              }
            }}
            // onChange={(e) => setMyMsg(e.target.value)}
            placeholder="Enter your message..."
            ref={props?.messageInputRef}
            // onKeyDown={(e) => {
            //   if (e.key === "Enter") {
            //     e.preventDefault(); // Prevent line break in the input field
            //     sendMsg(); // Call the sendMessage function when Enter is pressed
            //   }
            // }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault(); // Prevent line break in the input field
                if (myMsg.trim().length > 0) {
                  sendMsg(); // Call the sendMessage function when Enter is pressed and the message is not empty
                }
              }
            }}
          />
          <label
            htmlFor="profile_image"
            className="profile_image_label bg-body"
          >
            <MdAttachFile className="form-control-color text-dark fs-4" />
          </label>
          <input
            id="profile_image"
            className="form-control"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => {
              handleChangeUpload(e);
            }}
          />
          <button
            type="submit"
            // onClick={() => sendMsg()}
            disabled={loading}
            className="msger-send-btn"
          >
            {loading ? (
              <LoaderCenter />
            ) : (
              <BiSend className="form-control-color text-white" />
            )}
            {/* <BiSend className="form-control-color text-white" /> */}
          </button>
        </form>
      </div>
    </>
  );
}
const ImageModal = ({ imageUrl, onClose, size }) => {
  return (
    <Modal show={true} onHide={onClose} centered size={size}>
      <Modal.Body>
        <div className="image-modal">
          <img src={imageUrl} alt="zoomed-img" />
        </div>
      </Modal.Body>
    </Modal>
  );
};
