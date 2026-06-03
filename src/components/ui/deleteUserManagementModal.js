import React from "react";
import { Box, GenericModal } from "../core";
import { Button, Grid } from "@mui/material";
import MuiTypography from "../core/Typography";
import { BeatLoader } from "react-spinners";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { onFailure, onSuccess } from "@/redux/features/apiStatusSlice";
import { useDeleteSingleUserMutation } from "@/redux/slices/userProfile";

const DeleteUserManagementModal = ({
  setShowDeleteModal,
  showDeleteModal,
  userData,
  setRefetchData
}) => {
  const [deleteSingleUser, { isLoading }] = useDeleteSingleUserMutation();
  const dispatch=useDispatch()

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
  const handleDeleteRecord = async () => {
    try {
      const { userId } = userData;
      const resp = await deleteSingleUser(userId);
      if (resp?.data?.succeeded === true) {
        // Handle success
        dispatch(
          onSuccess({
            message: resp?.data?.message || "Success",
          })
        );
        setRefetchData(prevState => !prevState);
        setShowDeleteModal(false)
      } else {
        dispatch(
          onFailure({
            message: resp?.data?.message || "Failure",
          })
        );
      }
    } catch (error) {
      console.error("Error deleting doctor:", error);
      dispatch(
        onFailure({
          message: "An error occurred while deleting the doctor.",
        })
      );
    }
  };
  
  return (
    <GenericModal
      show={showDeleteModal}
      onHide={() => setShowDeleteModal(false)}
      size="sm"
    >
      <Grid container spacing={3}>
        <Box
          display="flex"
          justifyContent="center"
          flexDirection="column"
          textAlign="center"
          padding="20px"
        >
          <MuiTypography
            variant="h2"
            component="h2"
            color="#1A1A1A"
            fontWeight="600"
          >
            Delete Record
          </MuiTypography>
          <MuiTypography
            variant="h6"
            component="h6"
            fontWeight="400"
            sx={{ mt: 2 }}
          >
            Are you sure you want to Delete Record?
          </MuiTypography>
        </Box>
        <Box display="flex" justifyContent="center">
          <StyledButton
            sx={{ py: 1, px: 3, mr: 2 }}
            disabled={isLoading}
            onClick={handleDeleteRecord}
          >
            {isLoading ? <BeatLoader color="#fff" size="10px" /> : "Yes"}
          </StyledButton>
          <CancelButton
            sx={{ py: 1, px: 3 }}
            onClick={() => setShowDeleteModal(false)}
          >
            No
          </CancelButton>
        </Box>
      </Grid>
    </GenericModal>
  );
};

export default DeleteUserManagementModal;
