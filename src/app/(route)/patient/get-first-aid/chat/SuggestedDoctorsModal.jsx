import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import styled from "styled-components";
import { Button } from "@/components";
import {
  Avatar,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { Loader1 } from "@/components/core/Loader/Loader";
// Assuming Avatar is correctly imported from "@/components/webComponent/videoCall/avatar"

export default function SuggestedDepartmentsModal({
  open,
  handleClose,
  title,
  onConfirm,
  dept,
  doctorList,
  getDoctorsByDeptNameLoading,
  chatSessionId,
  errorMessage,
}) {
  const [showDept, setShowDept] = React.useState(null);
  const router = useRouter();
  console.log("dept:::", dept);
  console.log("chatSessionId:::::", chatSessionId);
  const StyledButton = styled(Button)`
    && {
      background: #e02828;
      font-weight: bold;
      border: none;
      &:hover {
        background: #e02828;
        border: none;
      }
    }
  `;

  const CancelButton = styled(Button)`
    && {
      background: transparent;
      border: 1px solid #e02828;
      color: #e02828;
      font-weight: bold;
      &:hover {
        background: transparent;
        border: 1px solid #e02828;
      }
    }
  `;
  return (
    <React.Fragment>
      <Dialog
        sx={{
          "& .MuiDialog-container": {
            "& .MuiPaper-root": {
              padding: "20px",
              width: "100%",
              maxWidth: "500px", // Set your width here
            },
          },
        }}
        open={true}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle sx={{ textAlign: "center" }} id="alert-dialog-title">
          {"Recommendation by AI"}
        </DialogTitle>
        <DialogContent
          sx={{
            paddingLeft: "15px",
            textAlign: `${!dept ? "center" : "center"}`,
          }}
        >
          <DialogContentText
            sx={{
              textAlign: `${!dept ? "center" : "start"}`,
              paddingLeft: 0,
              paddingBottom: "-10px",
              color: "black",
            }}
            id="alert-dialog-description"
          >
            {dept ? "Suggested Department" || "" : errorMessage || ""}
          </DialogContentText>
        </DialogContent>
        <DialogContentText
          sx={{
            textAlign: "center",
            paddingLeft: "0px",
            marginLeft: "15px",
            textAlign: "start",
            color: "black",
          }}
          id="alert-dialog-description"
        >
          {dept && `${dept?.department} `}
        </DialogContentText>
        {getDoctorsByDeptNameLoading ? (
          <Box
            sx={{ display: "flex", justifyContent: "center", height: "100px" }}
          >
            <Loader1 />
          </Box>
        ) : doctorList && doctorList?.length > 0 ? (
          <Box>
            <List
              sx={{
                width: "100%",
                maxWidth: "100%",
                bgcolor: "background.paper",
              }}
            >
              {doctorList.map((doctorDetail, index) => (
                <ListItem
                  alignItems="flex-start"
                  key={index}
                  sx={{ alignItems: "center" }}
                >
                  <ListItemAvatar>
                    <Avatar
                      alt="Doctor Avatar"
                      src={doctorDetail?.profileImageURL}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={doctorDetail.doctor}
                    secondary={
                      <React.Fragment>
                        <Typography
                          sx={{ display: "inline" }}
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {doctorDetail.email}
                        </Typography>
                      </React.Fragment>
                    }
                  />

                  <StyledButton
                    sx={{ py: 1, px: 3, mr: 2, justifyContent: "end" }}
                    onClick={() =>
                      router.push(
                        `book-appointments?doctorId=${doctorDetail?.doctorId}&sessionId=${chatSessionId}`
                      )
                    }
                  >
                    Book Appointment
                  </StyledButton>
                </ListItem>
              ))}
            </List>
          </Box>
        ) : (
          doctorList !== undefined && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                height: "100px",
                alignItems: "center",
              }}
            >
              No Doctor Available
            </Box>
          )
        )}

        {errorMessage && (
          <DialogActions sx={{ margin: "0 auto" }}>
            <StyledButton sx={{ py: 1, px: 3, mr: 2 }} onClick={handleClose}>
              Close
            </StyledButton>
          </DialogActions>
        )}
      </Dialog>
    </React.Fragment>
  );
}
