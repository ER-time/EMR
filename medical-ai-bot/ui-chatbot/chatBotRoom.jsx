"use client";

import { Box } from "@/components";
import { Paper } from "@mui/material";
import InputField from "@/components/core/Input";
import MuiTypography from "@/components/core/Typography";
import useScreenWidth from "@/hooks/useScreenWidth";
import { IconButton, InputAdornment } from "@mui/material";
import styled from "styled-components";
import MicIcon from "@mui/icons-material/Mic";
import SentimentSatisfiedOutlinedIcon from '@mui/icons-material/SentimentSatisfiedOutlined';
import AttachmentIcon from "@mui/icons-material/Attachment";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import { BiMessageRoundedDetail } from "react-icons/bi";

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

const ScrollableBox = styled(Box)`
  overflow: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  ::-webkit-scrollbar {
    width: 0;
    display: none;
  }
`;
const PAPER_PROPS = {
  width: "500px",
  backgroundColor: "#fff",
  boxShadow: "none",
  '@media (max-width: 695px)': {
    width: "400px"
  },
  '@media (max-width: 594px)': {
    width: "320px"
  },
};


export default function ChatBotRoom({
  showMessanger,
  setShowMessanger,
  setOpen,
}) {
  const screenWidth = useScreenWidth();

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

  const CHAT_DATA = [
    {
      type: "incoming",
      message:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lacus hendrerit ultrices fames nunc sit nulla arcu est est. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lacus hendrerit ultrices fames nunc sit nulla arcu est est. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lacus hendrerit ultrices fames nunc sit nulla arcu est est. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lacus hendrerit ultrices fames nunc sit nulla arcu est est. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lacus hendrerit ultrices fames nunc sit nulla arcu est est. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lacus hendrerit ultrices fames nunc sit nulla arcu est est.",
    },
    {
      type: "incoming",
      message:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lacus hendrerit ultrices fames nunc sit nulla arcu est est. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lacus hendrerit ultrices fames nunc sit nulla arcu est est. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lacus hendrerit ultrices fames nunc sit nulla arcu est est. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lacus hendrerit ultrices fames nunc sit nulla arcu est est. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lacus hendrerit ultrices fames nunc sit nulla arcu est est. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lacus hendrerit ultrices fames nunc sit nulla arcu est est.",
    },
    {
      type: "incoming",
      message:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lacus hendrerit ultrices fames nunc sit nulla arcu est est. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lacus hendrerit ultrices fames nunc sit nulla arcu est est. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lacus hendrerit ultrices fames nunc sit nulla arcu est est. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lacus hendrerit ultrices fames nunc sit nulla arcu est est. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lacus hendrerit ultrices fames nunc sit nulla arcu est est. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lacus hendrerit ultrices fames nunc sit nulla arcu est est.",
    },
    {
      type: "outgoing",
      message: "dummy lorem ipsum ",
    },

    {
      type: "outgoing",
      message:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lacus hendrerit ultrices fames nunc sit nulla arcu est est. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lacus hendrerit ultrices fames nunc sit nulla arcu est est. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lacus hendrerit ultrices fames nunc sit nulla arcu est est. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lacus hendrerit ultrices fames nunc sit nulla arcu est est. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lacus hendrerit ultrices fames nunc sit nulla arcu est est. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lacus hendrerit ultrices fames nunc sit nulla arcu est est.",
    },
  ];

  return (
    <Paper sx={{ ...PAPER_PROPS }}>
      <StyledUserChatContainer
        screenWidth={screenWidth}
        showMessanger={showMessanger}
        sx={{
          borderLeft: `${
            screenWidth < 992 && !showMessanger ? "1px solid #C3C3C3" : "none"
          }`,
          height: "600px",
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
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box display="flex" alignItems="center">
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  sx={{
                    bgcolor: "rgb(224, 40, 40)",
                    borderRadius: "50%",
                    width: "60px",
                    height: "50px",
                    mr: 1,
                  }}
                >
                  <BiMessageRoundedDetail size={32} color="#fff" />
                </Box>
                <Box>
                  <MuiTypography variant="h6" component="h6" fontWeight="600">
                    ChatBot
                  </MuiTypography>
                  <MuiTypography
                    variant="span"
                    component="span"
                    sx={{ fontSize: "15px" }}
                  >
                    Online
                  </MuiTypography>
                </Box>
                <IconButton onClick={() => setOpen(false)}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>
          </Box>
        </Box>

        <ScrollableBox
          sx={{ flex: 1 }}
          p={2}
          backgroundColor="#fff"
          id="chatmodule"
          style={{ height: `calc(100vh - 349px)`, overflow: "auto" }}
        >
          {CHAT_DATA.map((item, index) => (
            <Box display="flex" my={1} key={index}>
              {item.type === "incoming" && (
                <Box width="30px" sx={{ mr: 1 }}>
                  <BiMessageRoundedDetail size={28} color="rgb(224, 40, 40)" />
                </Box>
              )}

              <Box
                width="fit-content"
                bgcolor={`${item.type === "incoming" ? "none" : "#E02828"}`}
                p={2}
                m={`0px 0px 0px ${item.type === "incoming" ? "0px" : "auto"} `}
                sx={{
                  textAlign: `${item.type === "incoming" ? "left" : "right"}`,
                  border: `1px solid ${
                    item.type === "incoming" ? "#E3E3E3" : "none"
                  }`,
                  borderRadius: ` ${
                    item.type === "incoming"
                      ? "20px 20px 20px 0px"
                      : "20px 20px 0px 20px"
                  }`,
                }}
              >
                <MuiTypography
                  textAlign="start"
                  variant="subtitle1"
                  fontWeight="400"
                  color={`${item.type === "incoming" ? "#000" : "#fff"}`}
                >
                  {item?.message}
                </MuiTypography>
              </Box>
            </Box>
          ))}
        </ScrollableBox>

        <Box sx={{ borderTop: "1px solid #C3C3C3" }} p={2}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box display="flex" alignItems="center" sx={{ flex: 1 }}>
              <SentimentSatisfiedOutlinedIcon
                onClick={() => setShowMessanger(false)}
                sx={{
                  cursor: "pointer",
                  color: "rgb(224, 40, 40)",
                  fontSize: "25px",
                  mr: 1,
                }}
              />
              <AttachmentIcon
                onClick={() => setShowMessanger(false)}
                sx={{
                  cursor: "pointer",
                  color: "#9C9C9C",
                  fontSize: "30px",
                }}
              />
            </Box>
            <Box display="flex" alignItems="center" ml={1}>
              <Box sx={{ flex: 1 }}>
                <InputField
                  id="outlined-adornment-password"
                  type={"text"}
                  placeholder="Type a message here…"
                  endAdornment={
                    <InputAdornment position="end">
                      <SendButton
                        aria-label="toggle password visibility"
                        edge="end"
                      >
                        <SendIcon sx={{ color: "#fff" }} />
                      </SendButton>
                    </InputAdornment>
                  }
                  sx={INPUT_FIELD_STYLES_MESSAGE.sx}
                  {...INPUT_FIELD_PROPS_MESSAGE}
                />
              </Box>
              <MicIcon
                sx={{
                  cursor: "pointer",
                  color: "rgb(224, 40, 40)",
                  fontSize: "30px",
                  ml: 1,
                }}
              />
            </Box>
          </Box>
        </Box>
      </StyledUserChatContainer>
    </Paper>
  );
}
