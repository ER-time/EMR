import useScreenWidth from "@/hooks/useScreenWidth";
import { Paper } from "@mui/material";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import ChatItems from "./chatItems";
import ChatHistory from "./chatHistory";
import { CHAT_TYPE } from "@/config";

const PAPER_PROPS = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  backgroundColor: "#fff",
  borderRadius: "12px",
  boxShadow: "0px 4px 15px 0px #00000029",
  height: "100vh",
  // height: `calc(100vh - 116px)`,
  height: `calc(100vh - 150px)`,
  width: "100%",
};

const ChatContainer = ({ chatType, setChatView, setChatType }) => {
  const screenWidth = useScreenWidth();
  const [chatItemsState, setChatItemsState] = useState([]);
  const [chatItemLoading, setChatItemLoading] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [isSessionClosed, setIsSessionClosed] = useState(null);
  const session = useSession();

  let userID = session?.data?.user?.user?.userId;
  let showMessanger = true;

  useEffect(() => {
    async function fetchChatHistoryList() {
      try {
        setChatItemLoading(true);
        let url =
          chatType === CHAT_TYPE.prescription
            ? `https://medical-aibe.xeventechnologies.com/get_general_physician_previous_chat_history?user_id=${userID}`
            : `https://medical-aibe.xeventechnologies.com/get_psychiatrist_previous_chat_history?user_id=${userID}`;
        const response = await axios.post(url);
        if (
          response &&
          response?.data &&
          response?.data?.data &&
          response?.data?.data?.length > 0
        ) {
          setChatItemsState(
            response?.data?.data[0]?.previousConversation || []
          );
          setChatItemLoading(false);
        }
      } catch (error) {
        console.log(error);
        setChatItemLoading(false);
      }
    }

    if (session && session?.data?.user?.user?.userId) {
      fetchChatHistoryList();
    }
  }, [session]);

  return (
    <Paper
      screenWidth={screenWidth}
      showMessanger={showMessanger}
      sx={{
        ...PAPER_PROPS,
        borderLeft: `${
          screenWidth < 992 && !showMessanger ? "1px solid #C3C3C3" : "none"
        }`,
      }}
      display="flex"
      justifyContent="space-between"
      flexDirection="column"
    >
      <ChatItems
        chatItemsList={chatItemsState}
        selectedSessionId={selectedSessionId}
        setSelectedSessionId={setSelectedSessionId}
        setChatItemsState={setChatItemsState}
        setChatView={setChatView}
        setChatType={setChatType}
        isSessionClosed={isSessionClosed}
        setIsSessionClosed={setIsSessionClosed}
        loading={chatItemLoading}
      />
      <ChatHistory
        chatType={chatType}
        selectedSessionId={selectedSessionId}
        setChatItemsState={setChatItemsState}
        setSelectedSessionId={setSelectedSessionId}
        isSessionClosed={isSessionClosed}
        setIsSessionClosed={setIsSessionClosed}
      />
    </Paper>
  );
};

export default ChatContainer;
