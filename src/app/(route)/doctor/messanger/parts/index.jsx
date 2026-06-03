"use client";

import { Paper } from "@mui/material";
import { useEffect, useState } from "react";
import { useLazyGetAllConversationDetailsQuery, useLazyGetAllInboxesQuery } from "@/redux/slices/socketChat";
import { useSession } from "next-auth/react";
import ChatList from "./chatList";
import ChatRoom from "./chatRoom";
import useScreenWidth from "@/hooks/useScreenWidth";
import { useSocket } from "@/hooks/useSocket";

const PAPER_PROPS = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  backgroundColor: "#fff",
  borderRadius: "12px",
  boxShadow: "0px 4px 15px 0px #00000029",
  height: "100vh",
  height: `calc(100vh - 116px)`,
};

export default function MessangerView() {
  const screenWidth = useScreenWidth();
  const [showMessanger, setShowMessanger] = useState(true);
  const [messages, setMessages] = useState([]);
  const session = useSession();
  const [getAllInboxes, { data, isLoading }] = useLazyGetAllInboxesQuery();
  const [selectedInbox, setSelectedInbox] = useState(null);
  const socket = useSocket();

  useEffect(() => {
    async function fetchInboxes() {
      const response = await getAllInboxes();
      if (session) {
        setSelectedInbox(selectedInbox ? selectedInbox : response?.data?.data?.[0]);
      }
    }

    if (session) fetchInboxes();
  }, [session, messages]);

  const [GetAllConversationDetails, { data: GetAllConversationDetailsData, isLoading: GetAllConversationDetailsLoading }] = useLazyGetAllConversationDetailsQuery();

  useEffect(() => {
    if (session) {
      GetAllConversationDetails({ inboxId: selectedInbox?.inboxId || 1 });
    }
  }, [session, selectedInbox, GetAllConversationDetails]);

  useEffect(() => {
    if (GetAllConversationDetailsData?.data) {
      setMessages(GetAllConversationDetailsData.data);
    }
  }, [GetAllConversationDetailsLoading]);

  useEffect(() => {
    if (socket) {
      socket.on("roomMessage", (data) => {
        setMessages((prevMessages) => [...prevMessages, data]);
      });
    }
    return () => {
      if (socket) {
        socket.off("roomMessage");
      }
    };
  }, [socket]);

  return (
    <Paper sx={{ ...PAPER_PROPS }}>
      <ChatList
        socket={socket}
        isLoading={isLoading}
        getAllInboxes={data}
        showMessanger={showMessanger}
        setShowMessanger={setShowMessanger}
        setSelectedInbox={setSelectedInbox}
        selectedInbox={selectedInbox}
      />
      <ChatRoom
        socket={socket}
        showMessanger={showMessanger}
        setShowMessanger={setShowMessanger}
        selectedInbox={selectedInbox}
        GetAllConversationDetails={GetAllConversationDetails}
        GetAllConversationDetailsLoading={GetAllConversationDetailsLoading}
        GetAllConversationDetailsData={GetAllConversationDetailsData}
        setMessages={setMessages}
        messages={messages}
      />
    </Paper>
  );
}
