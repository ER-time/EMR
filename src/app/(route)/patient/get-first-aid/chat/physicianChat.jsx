"use client";

import { Box, Button } from "@/components";
import useScreenWidth from "@/hooks/useScreenWidth";
import { Avatar, IconButton, InputAdornment, Paper } from "@mui/material";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  useGetChatHistoryMutation,
  useGetRandomSessionIdMutation,
} from "@/redux/slices/chat";
import moment from "moment";
import { useSession } from "next-auth/react";
import { BeatLoader } from "react-spinners";
import { stringAvatar } from "@/lib/utils";
import ChatList from "./chatList";
import axios from "axios";
import PhysicianChatList from "./physicianChatList";
import PhysicianChatChatRoomHistory from "./physicianChatChatRoomHistory";

const StyledUserChatContainer = styled(Box)`
  display: ${(props) =>
    props.screenWidth < 992
      ? props.showMessanger === false
        ? "none"
        : "flex"
      : "flex"};
`;

const SendButton = styled(IconButton)`
  margin-right: 0px;
  background-color: rgb(224, 40, 40);
  :hover {
    background-color: rgb(224, 40, 40);
  }
`;
const StyledBox = styled(Box)`
  @media (max-width: 724px) {
    width: 100% !important;
    justify-content: end;
  }
`;
const StyledButton = styled(Button)`
  @media (max-width: 492px) {
    width: 100% !important;
  }
`;
const PAPER_PROPS = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  backgroundColor: "#fff",
  borderRadius: "12px",
  boxShadow: "0px 4px 15px 0px #00000029",
  height: "100vh",
  height: `calc(100vh - 116px)`,
  width: "100%",
};
export default function PsychiatristChatRoom({ showMessanger, randomNo }) {
  const session = useSession();
  let userID = session?.data?.user?.user?.userId;
  const screenWidth = useScreenWidth();
  const [selectedInbox, setSelectedInbox] = useState(null);
  const [messageArray, setMessageArray] = useState([]);
  const [showMessangers, setShowMessangers] = useState(true);
  const [dept, SetDept] = useState(null);
  const [doctorList, setDoctorList] = useState(null);
  const [chatHistoryList, setChatHistoryList] = useState(null);
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
  const [refreshTitle, setRefreshTitle] = useState(null);
  const [specificChatHistory, setSpecificChatHistory] = useState("");
  const [isChatEnded, setIsChatEnded] = useState(false);
  const [getRandomSessionId, { data, isLoading }] =
    useGetRandomSessionIdMutation();
  const [sessionIDTrigger, setSessionIDTrigger] = useState(false);
  useEffect(() => {
    if (session || sessionIDTrigger) getRandomSessionId();
  }, [userID, sessionIDTrigger]);

  useEffect(() => {
    async function fetchChatHistoryList() {
      try {
        const response = await axios.post(
          `https://medical-aibe.xeventechnologies.com/get_general_physician_previous_chat_history?user_id=${userID}`
        );
        setChatHistoryList(response);
      } catch (error) {
        console.log(error);
      }
    }
    if (session || refreshTitle) fetchChatHistoryList();
  }, [session, refreshTitle]);

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
      <PhysicianChatList
        socket={"socket"}
        isLoading={true}
        showMessanger={showMessangers}
        setShowMessanger={setShowMessangers}
        setSelectedInbox={setSelectedInbox}
        selectedInbox={selectedInbox}
        chatHistoryList={chatHistoryList}
        setSessionIDTrigger={setSessionIDTrigger}
        setSpecificChatHistory={setSpecificChatHistory}
        specificChatHistory={specificChatHistory}
        setIsChatEnded={setIsChatEnded}
        isChatEnded={isChatEnded}
        setMessageArray={setMessageArray}
        setRefreshTitle={setRefreshTitle}
      />
      <PhysicianChatChatRoomHistory
        SetDept={SetDept}
        dept={dept}
        doctorList={doctorList}
        setDoctorList={setDoctorList}
        showMessanger={showMessangers}
        setShowMessanger={setShowMessangers}
        selectedInbox={selectedInbox}
        setMessageArray={setMessageArray}
        messageArray={messageArray}
        randomNo={data}
        setShowDepartmentModal={setShowDepartmentModal}
        showDepartmentModal={showDepartmentModal}
        setRefreshTitle={setRefreshTitle}
        specificChatHistory={specificChatHistory}
        setSpecificChatHistory={setSpecificChatHistory}
        setIsChatEnded={setIsChatEnded}
        isChatEnded={isChatEnded}
      />
    </Paper>
  );
}
