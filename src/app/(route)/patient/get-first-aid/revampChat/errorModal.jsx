import { GenericModal } from "@/components";
import { Box, Button, Typography } from "@mui/material";
import React from "react";
import styled from "styled-components";

const StyledButton = styled(Button)`
  && {
    background: #fff;
    border: 1px solid #fd2121;
    color: #fd2121;
    font-weight: bold;

    &:hover {
      background: #fff;
      border: 1px solid #fd2121;
      color: #fd2121;
    }
  }
`;

const ErrorModal = ({ open, handleClose, tittle, departmentError }) => {
  console.log("departmentError", departmentError);
  return (
    <GenericModal
      size="sm"
      show={open}
      onHide={handleClose}
      tittle={tittle ? tittle : "Delete"}
    >
      <Typography
        textAlign="center"
        varient="span"
        color="#ff0000"
        component="p"
      >
        {departmentError || "Error"}
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: "20px",
        }}
      >
        <StyledButton
          sx={{ py: 1, px: 3, mr: 2 }}
          onClick={() => handleClose()}
        >
          Back To Chat
        </StyledButton>
      </Box>
    </GenericModal>
  );
};

export default ErrorModal;
