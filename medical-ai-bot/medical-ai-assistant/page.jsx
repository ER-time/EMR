"use client";
import { useState } from "react"; // Import useState and useEffect
import { Box, Button } from "@/components";
import MuiTypography from "@/components/core/Typography";
import { Paper } from "@mui/material";
import Image from "next/image";
import ChatView from "./revampChat";
import styled from "styled-components";
import { Loader1 } from "@/components/core/Loader/Loader";
import { CHAT_TYPE } from "@/config";

const PAPER_PROPS = {
  backgroundColor: "#fff",
  boxShadow: "0px 0px 24px 0px rgba(0, 0, 0, 0.04)",
  border: "1px solid #E6E6E6",
  minHeight: "520px",
  maxWidth: "700px",
  width: "100%",
  padding: "20px",
  borderRadius: "4px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const StyledInnerBox = styled(Box)`
  max-width: 400px;
  width: 100%;
  margin: auto;
  text-align: center;
`;

export default function GetFirstAid() {
  const [chatView, setChatView] = useState(false);

  const [chatType, setChatType] = useState(null);

  const showPrescriptionChat = (type) => {
    setChatType(type);
    setChatView(true);
  };

  return (
    <>
      {chatView ? (
        <ChatView
          chatType={chatType}
          setChatView={setChatView}
          setChatType={setChatType}
        />
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          style={{ minHeight: `calc(100vh - 150px)` }}
        >
          <Paper
            sx={{
              ...PAPER_PROPS,
            }}
          >
            <StyledInnerBox>
              <div
                style={{
                  position: "relative",
                  height: "200px",
                  maxWidth: "200px",
                  margin: "auto",
                }}
              >
                <Image
                  src={"/images/doctor-avatar.png"}
                  loading="lazy"
                  layout="fill"
                  objectFit="contain"
                  style={{
                    objectFit: "contain",
                  }}
                  alt="user-img"
                />
              </div>

              <MuiTypography
                variant="body1"
                component="p"
                color="#000"
                sx={{ my: 2 }}
              >
                Hi there! I am doctor bot. I am here to help you diagnose your
                symptoms and find a better treatment plan for you.
              </MuiTypography>

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-around",
                }}
              >
                <Button
                  variant="contain"
                  bg="#E02828"
                  color="#fff"
                  height="45px"
                  radius="12px"
                  width="160px"
                  marginLeft="20px"
                  marginBottom="10px"
                  sx={{ marginBottom: "10px" }}
                  onClick={() => showPrescriptionChat(CHAT_TYPE.prescription)}
                >
                  General Physician
                </Button>
                <Button
                  variant="contain"
                  bg="#E02828"
                  color="#fff"
                  height="45px"
                  radius="12px"
                  width="160px"
                  onClick={() => showPrescriptionChat(CHAT_TYPE.psychiatrist)}
                >
                  Psychiatrist
                </Button>
              </Box>
            </StyledInnerBox>
          </Paper>
        </Box>
      )}
    </>
  );
}
