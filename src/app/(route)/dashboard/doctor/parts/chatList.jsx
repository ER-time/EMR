import { Avatar, Divider } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AddIcon from "@mui/icons-material/Add";
import styled from "styled-components";

import { Box } from "@/components";
import MuiTypography from "@/components/core/Typography";
import { useRouter } from "next/navigation";
import { useLazyGetAllInboxesQuery } from "@/redux/slices/socketChat";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { truncate } from "@/lib/utils";
import { Loader1 } from "@/components/core/Loader/Loader";

const StyledButton = styled(Box)`
  && {
    border: 1px solid #e5e6e6;
    padding: 10px;
    display: flex;
    border-radius: 6px;
    cursor: pointer;
  }
`;
export default function ChatList() {
  const session = useSession();
  const router = useRouter();
  const [getAllInboxes, { data, isLoading }] = useLazyGetAllInboxesQuery();
  useEffect(() => {
    async function fetchInboxes() {
      const response = await getAllInboxes();
    }

    if (session) fetchInboxes();
  }, [session]);
  console.log("data::::", data);

  // const CHAT_LIST = [
  //   {
  //     name: "Jeremiah Green",
  //     message: "Hello, Lorem Ipsum is simply dummy text...",
  //   },
  //   {
  //     name: "Jeremiah Green",
  //     message: "Hello, Lorem Ipsum is simply dummy text...",
  //   },
  //   {
  //     name: "Jeremiah Green",
  //     message: "Hello, Lorem Ipsum is simply dummy text...",
  //   },
  //   {
  //     name: "Jeremiah Green",
  //     message: "Hello, Lorem Ipsum is simply dummy text...",
  //   },
  // ];
  const CHAT_LIST =
    Array.isArray(data?.data) && data?.data?.length > 0
      ? data?.data.slice(0, 5).map((currentInbox) => ({
          name: currentInbox?.name || "N/A",
          message: truncate(currentInbox?.lastMsg, 60) || "N/A",
        }))
      : [];
  return (
    <Box p="15px" height="100%">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <MuiTypography
          variant="body1"
          component="h6"
          color="#1A1A1A"
          fontWeight="600"
        >
          Chats
        </MuiTypography>
        {/* <StyledButton
          width="auto"
          onClick={() => router.push("/doctor/messanger")}
        >
          <AddIcon />
        </StyledButton> */}
      </Box>
      <Box display="flex" flexDirection="column" justifyContent="">
        {isLoading ? (
          <Loader1 />
        ) : CHAT_LIST.length > 0 ? (
          CHAT_LIST.map((item, index) => (
            <>
              <Box
                display="flex"
                py="15px"
                key={index}
                sx={{ cursor: "pointer" }}
                onClick={() => router.push("/doctor/messanger")}
              >
                <Box display="flex">
                  <Avatar
                    sx={{
                      bgcolor: "rgb(224, 40, 40)",
                      width: 40,
                      height: 40,
                    }}
                  >
                    OP
                  </Avatar>
                  <div>
                    <MuiTypography
                      variant="body2"
                      component="h6"
                      color="#2E3130"
                      fontWeight="500"
                      sx={{ mx: "10px" }}
                    >
                      {item.name}
                    </MuiTypography>
                    <MuiTypography
                      variant="body2"
                      component="p"
                      color="#4A4F4D"
                      fontWeight="300"
                      sx={{ mx: "10px" }}
                    >
                      {item.message}
                    </MuiTypography>
                  </div>
                </Box>
                <ChevronRightIcon />
              </Box>
              <Divider />
            </>
          ))
        ) : (
          "No Chat"
        )}

        <Box
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
          my={4}
        >
          <MuiTypography
            variant="body2"
            component="span"
            color="#999999"
            fontWeight="300"
            sx={{ mx: "10px" }}
            className="cursor-pointer"
            onClick={() => router.push("/doctor/messanger")}
          >
            View All
          </MuiTypography>
          <ArrowForwardIcon sx={{ fontSize: "16px", color: "#999999" }} />
        </Box>
      </Box>
    </Box>
  );
}
