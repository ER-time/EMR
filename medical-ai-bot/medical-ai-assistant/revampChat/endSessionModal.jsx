import React from "react";
import {
  Button,
  GenericModal,
  Typography,
} from "../../../../../components/core";
import styled from "styled-components";
import { Box } from "@mui/material";
import { Loader1 } from "@/components/core/Loader/Loader";

const StyledButton = styled(Button)`
  && {
    background: #fd2121;
    font-weight: bold;
    border: none;
    &:hover {
      background: #fd2121;
      border: none;
    }
  }
`;

const CancelButton = styled(Button)`
  && {
    background: transparent;
    border: 1px solid #fd2121;
    color: #fd2121;
    font-weight: bold;
    &:hover {
      background: transparent;
      border: 1px solid #fd2121;
    }
  }
`;

export default function EndSessionModal({
  open,
  handleClose,
  tittle,
  onConfirm,
  loading,
}) {
  return (
    <GenericModal
      size="sm"
      show={open}
      onHide={handleClose}
      tittle={tittle ? tittle : "Delete"}
    >
      <Typography textAlign="center" varient="span" component="p">
        Are you sure you want to end this session?
      </Typography>
      {/* <Box display="flex" justifyContent="center" flexWrap="wrap">
        <Button
          variant="contain"
          bg="#fff"
          color="#E02828"
          height="45px"
          radius="12px"
          width="120px"
          sx={{ margin: "10px", border: "1px solid #E02828" }}
          onClick={() => handleClose()}
        >
          Cancel
        </Button>
        <Button
          variant="contain"
          bg="#E02828"
          color="#fff"
          height="45px"
          radius="12px"
          width="120px"
          sx={{ margin: "10px" }}
          onClick={() => onConfirm()}
        >
          {loading ? <BeatLoader color="#fff" size="10px" /> : "Confirm"}
        </Button>
      </Box> */}
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
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <StyledButton
            sx={{ py: 1, px: 3, mr: 2 }}
            // onClick={() => {
            //   setShowDept(true);
            //   onConfirm();
            // }}
            onClick={() => onConfirm()}
          >
            Yes
          </StyledButton>
          <CancelButton sx={{ py: 1, px: 3 }} onClick={handleClose}>
            No
          </CancelButton>
        </Box>
      )}
    </GenericModal>
  );
}
