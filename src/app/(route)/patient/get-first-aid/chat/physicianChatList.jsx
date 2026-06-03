"use client";

import { Box } from "@/components";
import { Loader1 } from "@/components/core/Loader/Loader";
import MuiTypography from "@/components/core/Typography";
import useScreenWidth from "@/hooks/useScreenWidth";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import styled from "styled-components";
import AddCommentOutlinedIcon from "@mui/icons-material/AddCommentOutlined";
import { useGetChatHistoryMutation } from "@/redux/slices/chat";

const StyledUserContainer = styled(Box)`
  display: ${(props) =>
    props.screenWidth < 992
      ? props.showMessanger === true
        ? "none"
        : "block"
      : "block"};
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
export default function PhysicianChatList({
  showMessanger,
  setShowMessanger,
  setSelectedInbox,
  selectedInbox,
  chatHistoryList,
  setSessionIDTrigger,
  setSpecificChatHistory,
  specificChatHistory,
  setIsChatEnded,
  setMessageArray,
  setRefreshTitle,
}) {
  const screenWidth = useScreenWidth();
  const [inboxData, setInboxesData] = useState();
  const data = chatHistoryList;
  const INPUT_FIELD_PROPS_SEARCH = {
    label: "",
    fullWidth: true,
    variant: "standard",
  };

  return (
    <StyledUserContainer
      screenWidth={screenWidth}
      showMessanger={showMessanger}
      sx={{
        borderRight: `${
          screenWidth < 992 && !showMessanger ? "none" : "1px solid #C3C3C3"
        }`,
      }}
      maxWidth={`${screenWidth < 992 && !showMessanger ? "100%" : "300px"}`}
    >
      <Box>
        <List
          onClick={() => {
            setSessionIDTrigger((pre) => !pre);
            setSelectedInbox(null);
            setSpecificChatHistory("");
            setIsChatEnded(false);
            setRefreshTitle((pre) => !pre);
            setMessageArray([]);
          }}
        >
          <ListItem
            disablePadding
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <ListItemButton>
              <ListItemText primary="New Chat" />
              <ListItemIcon sx={{ display: "flex", justifyContent: "end" }}>
                <AddCommentOutlinedIcon cursor="pointer" />
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
      {inboxData?.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "90%",
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
              No Chat history to show
            </p>
          </Box>
        </Box>
      ) : (
        <ScrollableBox
          style={{ overflow: "auto", height: `calc(100vh - 188px)` }}
        >
          {chatHistoryList?.data?.data?.map((item, index) => {
            return (
              <div key={index}>
                {item.previousConversation?.map((conversation, convoIndex) => (
                  <MessangerUserListItem
                    key={convoIndex}
                    item={conversation}
                    setShowMessanger={setShowMessanger}
                    setSelectedInbox={setSelectedInbox}
                    selectedInbox={selectedInbox}
                  />
                ))}
              </div>
            );
          })}
        </ScrollableBox>
      )}
    </StyledUserContainer>
  );
}

const StyledBox = styled(Box)`
  cursor: pointer;
  :hover {
    background: rgba(224, 40, 40, 0.274);
  }
  background: ${(props) =>
    props.selectedInbox ? "rgba(224, 40, 40, 0.274)" : "transparent"};
`;

const MessangerUserListItem = ({
  setShowMessanger,
  item,
  setSelectedInbox,
  selectedInbox,
}) => {
  const isSelected = selectedInbox?.session_id === item.session_id;
  return (
    <StyledBox
      display="flex"
      alignItems="center"
      selectedInbox={isSelected}
      pr={1}
      py={0.5}
      m={1}
      borderBottom="1px solid #DCDCDC"
      onClick={() => {
        setShowMessanger(true);
        setSelectedInbox(item);
      }}
    >
      <Box display="flex" ml="5px">
        <div style={{ flex: 1 }}>
          <MuiTypography variant="subtitle1" component="p" fontWeight="500">
            {item?.title ? item?.title : "Welcome to new chat"}
          </MuiTypography>
        </div>
      </Box>
    </StyledBox>
  );
};
