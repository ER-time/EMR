import { Container } from "@mui/material";

import useWidthToggle from "@/hooks/useWidthToggle";
import { useSession } from "next-auth/react";

import Sidebar from "./sidebar";
import Navbar from "./navbar/navbar";
import { Box } from "../core";
import ChatBotButton from "../core/chatbot";
import { usePathname, useRouter } from "next/navigation";
import { USER_ROLE } from "@/config";

const DashboardLayout = ({ children }) => {
  const [width, toggleWidth, shouldRenderButton] = useWidthToggle(250, 90, 992);
  const session = useSession();
  const loggedInUser = session?.data?.user?.user;
  const pathname = usePathname();
  const renderChatbotButton = () => {
    if (
      loggedInUser?.roleId === USER_ROLE.doctor &&
      pathname !== "/doctor/messanger"
    ) {
      return <ChatBotButton />;
    }
    return null;
  };
  return (
    <div>
      <div>
        <div>
          <Sidebar
            width={width}
            toggleWidth={toggleWidth}
            shouldRenderButton={shouldRenderButton}
          />
          <div
            style={{
              flex: 1,
              background: "#FAFBFC",
              marginLeft: `${width}px`,
              transition: "margin-left 0.5s",
              minHeight: "100vh",
            }}
          >
            <Navbar width={width} />
            <Box
              component="main"
              sx={{
                backgroundColor: (theme) =>
                  theme.palette.mode === "light"
                    ? theme.palette.grey[100]
                    : theme.palette.grey[900],
                flexGrow: 1,
                height: `calc(100vh - 84px)`,
                overflow: "auto",
              }}
            >
              <Container maxWidth="xxl" sx={{ mt: 4, mb: 4 }}>
                {children}
                {/* {renderChatbotButton()} */}
              </Container>
            </Box>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
