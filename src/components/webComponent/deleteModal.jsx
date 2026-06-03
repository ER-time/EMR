import React from "react";
import { Box, Button, GenericModal, Typography } from "../core";
import { BeatLoader } from "react-spinners";

export default function DeleteModal({ open, handleClose, tittle, onConfirm,loading }) {
  return (
    <GenericModal
      size="sm" 
      show={open}
      onHide={handleClose}
      tittle={tittle ? tittle : "Delete"}
    >
      <Typography textAlign="center" varient="span" component="p" color="red">
        Are you sure you want to delete this record?
      </Typography>

      <Box display="flex" justifyContent="center" flexWrap="wrap">
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
      </Box>
    </GenericModal>
  );
}
