"use client";

import { Paper } from "@mui/material";
import { useEffect, useState } from "react";
import ChatRoom from "./physicianChat";
import PsychiatristChatRoom from "./psychiatristChatRoom";

export default function ChatView({ chatType }) {
  const [showMessanger, setShowMessanger] = useState(false);

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
      {chatType === "psychiatrist" ? (
        <PsychiatristChatRoom
          showMessanger={showMessanger}
          setShowMessanger={setShowMessanger}
        />
      ) : (
        <ChatRoom
          showMessanger={showMessanger}
          setShowMessanger={setShowMessanger}
        />
      )}
    </Paper>
  );
}
