"use client";

import { Paper } from "@mui/material";
import { useEffect, useState } from "react";
import ChatRoom from "./chatRoom";
import {
  useLazyGetAllConversationDetailsQuery,
  useLazyGetAllInboxesQuery,
} from "@/redux/slices/socketChat";
import { io } from "socket.io-client";
import useScreenWidth from "@/hooks/useScreenWidth";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { SOCKET_URI } from "@/config";

export default function ChatView() {
  const [showMessanger, setShowMessanger] = useState(false);
  const searchParams = useSearchParams();
  const inboxId = searchParams.get("inboxId");
  const session = useSession();
  const [messages, setMessages] = useState([]);
  const [getAllInboxes, { data, isLoading }] = useLazyGetAllInboxesQuery();
  const [selectedInbox, setSelectedInbox] = useState(inboxId);
  const socket = io(SOCKET_URI);

  const [
    GetAllConversationDetails,
    {
      data: GetAllConversationDetailsData,
      isLoading: GetAllConversationDetailsLoading,
    },
  ] = useLazyGetAllConversationDetailsQuery();

  useEffect(() => {
    if (session) {
      GetAllConversationDetails({ inboxId: selectedInbox });
    }
  }, [session, selectedInbox, GetAllConversationDetails]);

  useEffect(() => {
    if (GetAllConversationDetailsData?.data) {
      setMessages(GetAllConversationDetailsData.data);
    }
  }, [GetAllConversationDetailsLoading]);

  //

  const PAPER_PROPS = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0px 4px 15px 0px #00000029",
    display: "flex",
    height: "100vh",
    height: `calc(100vh - 116px)`,
  };

  return (
    <Paper sx={{ ...PAPER_PROPS }}>
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
