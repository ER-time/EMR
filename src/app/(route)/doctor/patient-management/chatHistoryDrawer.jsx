import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import MuiTypography from "@/components/core/Typography";
import { Avatar } from "@mui/material";
import styled from "styled-components";
import { useEffect, useRef, useState } from "react";
import { Loader1 } from "@/components/core/Loader/Loader";

const ScrollableBox = styled(Box)`
  overflow: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  ::-webkit-scrollbar {
    width: 0;
    display: none;
  }
`;

const stringAvatar = (name) => {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name?.split(" ")[0][0] || ""}`,
  };
};

const stringToColor = (string) => {
  let hash = 0;
  for (let i = 0; i < string?.length; i++) {
    hash = string?.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
};

const getCurrentTime = () => {
  const now = new Date();
  return now.toLocaleTimeString();
};

export default function ChatHistoryDrawer({
  state,
  toggleDrawer,
  rowId,
  setRowId,
}) {
  const [messageArray, setMessageArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  console.log("rowId::::", rowId);
  useEffect(() => {
    if (!rowId?.chatSessionId) return; // Exit early if no chatSessionId

    const fetchSingleChatHistory = async () => {
      debugger
      setLoading(true); // Start loading

      try {
        const payload = {
          user_id: rowId?.patientId || "",
          session_id: rowId?.chatSessionId || "",
        };

        // API calls as described earlier
        const physicianResponse = axios.post(
          "https://medical-aibe.xeventechnologies.com/get_general_physician_specific_chat",
          payload
        );

        const psychiatristResponse = axios.post(
          "https://medical-aibe.xeventechnologies.com/get_psychiatrist_specific_chat",
          payload
        );

        const [physicianResult, psychiatristResult] = await Promise.all([
          physicianResponse.catch((error) => null),
          psychiatristResponse.catch((error) => null),
        ]);

        const response =
          physicianResult?.data?.history?.length > 0
            ? physicianResult
            : psychiatristResult?.data?.history?.length > 0
            ? psychiatristResult
            : null;

        if (response) {
          const chatHistory = response.data.history || [];
          const formattedMessages = chatHistory
            .map((item) => [
              {
                type: "outgoing",
                message:
                  item.user
                    ?.replace("User:", "")
                    .replace("<END_OF_TURN>", "")
                    .trim() || "",
                timestamp: getCurrentTime(),
              },
              {
                type: "incoming",
                message:
                  item.AiRes?.replace("William:", "")
                    .replace("<END_OF_TURN>", "")
                    .trim() || "",
                timestamp: getCurrentTime(),
              },
            ])
            .flat();
          setMessageArray(formattedMessages);
        } else {
          console.log("No chat history available from both APIs.");
          setLoading(false);
        }
      } catch (error) {
        console.log("error", error);
        setLoading(false);
      }

      setLoading(false); // Stop loading after the data fetch is complete
    };

    fetchSingleChatHistory();
  }, [rowId]);

  const handleClose = () => {
    setRowId("");
    setMessageArray([]);
    toggleDrawer("right", false)();
  };

  console.log("messageArray:::", messageArray);
  return (
    <Drawer anchor="right" open={state.right} onClose={handleClose}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItem="center"
        p={2}
      >
        <Box sx={{ mt: 1 }}>
          <MuiTypography>Chat History</MuiTypography>
        </Box>
        <Box>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>
      <ScrollableBox
        p={2}
        backgroundColor="#fff"
        style={{ height: `calc(100vh - 109px)` }}
      >
        {loading ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              minWidth: "300px",
              textAlign: "center", // Center-align text
            }}
          >
            <Loader1 /> {/* Show loader while loading */}
          </Box>
        ) : messageArray.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              minWidth: "300px",
              textAlign: "center", // Center-align text
            }}
          >
            <img
              src="/images/newChat.png"
              alt="Icon representing starting a new chat"
            />
            <MuiTypography
              mt={2}
              width="100%" // Make the text span the full width of its container
              maxWidth="300px" // You can control the maximum width
              sx={{
                fontSize: "1.2rem", // Make the text slightly larger
                fontWeight: "500", // Add some weight to the text
              }}
            >
              No chat history available
            </MuiTypography>
          </Box>
        ) : (
          messageArray.map((item, index) => (
            <Box
              key={index}
              display="flex"
              flexDirection={item.type === "incoming" ? "row" : "row-reverse"}
              my={2}
              maxWidth="500px"
            >
              {item.type === "incoming" && (
                <Avatar
                  {...stringAvatar("William")}
                  sx={{
                    bgcolor: "rgb(224, 40, 40)",
                    width: 50,
                    height: 50,
                    mr: 1,
                    p: "2px",
                    mt: "4px",
                  }}
                />
              )}
              {item.type === "outgoing" && (
                <Avatar
                  {...stringAvatar(rowId?.patient || "Unknown")}
                  sx={{
                    bgcolor: "rgb(224, 40, 40)",
                    width: 40,
                    height: 40,
                    mr: 1,
                    ml: 1,
                    p: "6px",
                    mt: "6px",
                  }}
                />
              )}
              <Box>
                <Box
                  width="fit-content"
                  bgcolor={item.type === "incoming" ? "none" : "#E02828"}
                  p={2}
                  m={`0px 0px 0px ${
                    item.type === "incoming" ? "0px" : "auto"
                  } `}
                  sx={{
                    textAlign: item.type === "incoming" ? "left" : "right",
                    border: `1px solid ${
                      item.type === "incoming" ? "#E3E3E3" : "none"
                    }`,
                    borderRadius:
                      item.type === "incoming"
                        ? "20px 20px 20px 0px"
                        : "20px 20px 0px 20px",
                  }}
                >
                  <MuiTypography
                    textAlign="start"
                    variant="subtitle1"
                    fontWeight="400"
                    color={item.type === "incoming" ? "#000" : "#fff"}
                  >
                    {item.message}
                  </MuiTypography>
                </Box>
                {/* <MuiTypography
                  variant="subtitle1"
                  fontWeight="400"
                  fontSize="12px"
                  color="#9C9C9C"
                  sx={{
                    pt: 1,
                    textAlign: item.type === "incoming" ? "left" : "right",
                  }}
                >
                  {item.timestamp}
                </MuiTypography> */}
              </Box>
            </Box>
          ))
        )}
        <div ref={bottomRef} />
      </ScrollableBox>
    </Drawer>
  );
}
