import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import MuiTypography from "../Typography";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",

  bgcolor: "#FFF",
  boxShadow: 24,
  borderRadius: "10px",
  py: 3,
};

export default function TransitionsModal({
  show,
  onHide,
  size,
  children,
  ...props
}) {
  const INPUT_LABEL_PROPS = {
    variant: "h6",
    component: "h6",
    fontWeight: "500",
    spacing: "0.1px",
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={show}
      onClose={onHide}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={show}>
        <Box
          p="0px"
          sx={{
            width: "100%",
            maxWidth: {
              xs: `${
                size === "lg"
                  ? "70%"
                  : size === "md"
                  ? "70%"
                  : size === "sm"
                  ? "70%"
                  : size === "xs"
                  ? "70%"
                  : "70%"
              }`,
              sm: `${
                size === "lg"
                  ? "70%"
                  : size === "md"
                  ? "70%"
                  : size === "sm"
                  ? "70%"
                  : size === "xs"
                  ? "70%"
                  : "70%"
              }`,
              md: `${
                size === "lg"
                  ? "70%"
                  : size === "md"
                  ? "50%"
                  : size === "sm"
                  ? "30%"
                  : size === "xs"
                  ? "20%"
                  : "70%"
              }`,
            },

            // sx={{ maxWidth: { xs: "none", sm: "block" }, margin: "auto" }},
            ...style,
          }}
        >
          <Box
            mb={"15px"}
            display="flex"
            justifyContent="space-between"
            alignItems={"center"}
            px={4}
          >
            <MuiTypography
              {...INPUT_LABEL_PROPS}
              htmlFor="lastName"
              gutterBottom={false}
            >
              {props.tittle}
            </MuiTypography>
            <IconButton onClick={() => onHide()}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box maxHeight="500px" px={4} overflow="auto">
            {children}
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
}

TransitionsModal.defaultProps = {
  size: "md",
};
