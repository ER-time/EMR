import useScreenWidth from "@/hooks/useScreenWidth";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import React from "react";
import styled from "styled-components";
import AddCommentOutlinedIcon from "@mui/icons-material/AddCommentOutlined";
import axios from "axios";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Loader1 } from "@/components/core/Loader/Loader";
import moment from "moment";

const StyledUserContainer = styled(Box)`
  display: ${(props) =>
    props.screenWidth < 992
      ? props.showMessanger === true
        ? "none"
        : "block"
      : "block"};
`;

const ChatItems = ({
  chatItemsList,
  setSelectedSessionId,
  selectedSessionId,
  setChatView,
  setChatType,
  setIsSessionClosed,
  loading,
}) => {
  console.log("chatItemsList::::", chatItemsList);
  const screenWidth = useScreenWidth();
  let showMessanger = true;

  const getRandomSessionId = async () => {
    try {
      const response = await axios.get(
        "https://medical-aibe.xeventechnologies.com/generate_random_session_id"
      );
      if (
        response &&
        response?.data &&
        response?.data?.data &&
        response?.data?.data?.length > 0
      ) {
        setSelectedSessionId(response?.data?.data[0]?.session_id);
        setIsSessionClosed(false);
      }
    } catch (error) {
      console.log("error", error);
    }
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
        <Box
          sx={{
            paddingLeft: "20px",
            paddingRight: "20px",
            paddingTop: "20px",
            display: "flex",
            gap: 2,
          }}
        >
          <ArrowBackIcon
            onClick={() => {
              setChatView(false);
              setChatType(null);
            }}
            sx={{ cursor: "pointer" }}
          />
          <Typography>Go Back</Typography>
        </Box>

        <List>
          <ListItem
            disablePadding
            sx={{ display: "flex", justifyContent: "space-between" }}
            onClick={() => {
              getRandomSessionId();
            }}
          >
            <ListItemButton>
              <ListItemText primary="New Chat" />
              <ListItemIcon sx={{ display: "flex", justifyContent: "end" }}>
                <AddCommentOutlinedIcon cursor="pointer" />
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
        </List>
        <List
          sx={{
            height: `calc(100vh - 300px)`,
            overflowY: "auto",
            minWidth: "300px",
            width: "100%",
          }}
        >
          {loading === true ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                height: "100px",
                marginTop: "20px",
              }}
            >
              <Loader1 />
            </Box>
          ) : loading === false && chatItemsList?.length > 0 ? (
            <>
              {chatItemsList?.map((chatItem, index) => (
                <ListItem
                  key={index}
                  disablePadding
                  sx={{
                    borderBottom: `${
                      index !== chatItemsList.length - 1
                        ? "1px solid rgb(220, 220, 220)"
                        : "0px solid rgb(220, 220, 220)"
                    }`,
                    background:
                      selectedSessionId === chatItem?.session_id
                        ? "rgba(224, 40, 40, 0.275)"
                        : "#fff",
                  }}
                  onClick={() => setSelectedSessionId(chatItem?.session_id)}
                >
                  <ListItemButton
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    <ListItemText primary={chatItem?.title} />
                    {/* Date aligned to the right */}
                    <Box sx={{ width: "100%", textAlign: "right" }}>
                      <p style={{ margin: 0, fontSize: "12px", color: "gray" }}>
                        {moment(chatItem?.time).format("MM/DD/YYYY")}
                      </p>
                    </Box>
                  </ListItemButton>
                </ListItem>
              ))}
            </>
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                height: "100px",
                marginTop: "20px",
              }}
            >
              No History
            </Box>
          )}
        </List>
      </Box>
    </StyledUserContainer>
  );
};

export default ChatItems;
