import * as React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { Fade, Paper, Popper } from "@mui/material";
import styled from "styled-components";
import { BsRobot } from "react-icons/bs";

import ChatBotRoom from "./chatBotRoom";

const StyledChatBot = styled.div`
  position: absolute;
  z-index: 9;
  bottom: 20px;
  right: 30px;
`;
const StyledIconButton = styled(IconButton)`
  && {
    :hover {
      background-color: #E02828;
    }
  }
`;

export default function ChatBotButton() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [placement, setPlacement] = React.useState();

  const handleClick = (newPlacement) => (event) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
    setPlacement(newPlacement);
  };

  return (
    <StyledChatBot>
      <Box>
        <Popper
          open={open}
          anchorEl={anchorEl}
          placement={placement}
          transition
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <Paper>
                <ChatBotRoom setOpen={setOpen} />
              </Paper>
            </Fade>
          )}
        </Popper>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <StyledIconButton
            onClick={handleClick("left-end")}
            size="small"
            sx={{ p: 2, background: "#E02828" }}
          >
            <BsRobot size={40} color="#fff" />
          </StyledIconButton>
        </Box>
      </Box>
    </StyledChatBot>
  );
}
