import { GenericModal } from "@/components";
import { Loader1 } from "@/components/core/Loader/Loader";
import { useLazyGetDoctorsByDeptNameQuery } from "@/redux/slices/doctors";
import {
  Avatar,
  Box,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import styled from "styled-components";

const StyledButton = styled(Button)`
  && {
    background: #fff;
    border: 1px solid #fd2121;
    color: #fd2121;
    font-weight: bold;
    text-transform: capitalize;
    font-size: 12px;

    &:hover {
      background: #fff;
      border: 1px solid #fd2121;
      color: #fd2121;
      text-transform: capitalize;
      font-size: 12px;
    }
  }
  span {
    font-size: 12px !important;
  }
`;

const SuggestedDoctorModal = ({
  open,
  handleClose,
  tittle,
  suggestedDepartment,
  selectedSessionId,
}) => {
  const router = useRouter();

  const [
    getDoctorsByDeptName,
    { data: getDoctorsByDeptNameData, isLoading: getDoctorsByDeptNameLoading },
  ] = useLazyGetDoctorsByDeptNameQuery();

  const getSugestedDepartment = async () => {
    await getDoctorsByDeptName(suggestedDepartment);
  };

  useEffect(() => {
    if (suggestedDepartment) {
      getSugestedDepartment();
    }
  }, [suggestedDepartment]);

  return (
    <GenericModal
      size="sm"
      show={open}
      onHide={handleClose}
      tittle={tittle ? tittle : "Delete"}
    >
      <Box sx={{ display: "flex", gap: 3 }}>
        <Typography sx={{ fontWeight: "bold" }}>
          Recomended Department:
        </Typography>

        <Typography sx={{ fontWeight: "500" }}>
          {suggestedDepartment || ""}
        </Typography>
      </Box>

      {getDoctorsByDeptNameLoading ? (
        <Box
          sx={{ display: "flex", justifyContent: "center", height: "100px" }}
        >
          <Loader1 />
        </Box>
      ) : getDoctorsByDeptNameData &&
        getDoctorsByDeptNameData?.data?.length > 0 ? (
        <Box>
          <List
            sx={{
              width: "100%",
              maxWidth: "100%",
              bgcolor: "background.paper",
            }}
          >
            {getDoctorsByDeptNameData?.data?.map((doctorDetail, index) => (
              <ListItem
                alignItems="flex-start"
                key={index}
                sx={{
                  alignItems: "center",
                  paddingLeft: "0px",
                  paddingRight: "0px",
                }}
              >
                {/* <ListItemAvatar> */}
                <Avatar
                  alt="Doctor Avatar"
                  src={doctorDetail?.profileImageURL}
                  sx={{ marginRight: "5px" }}
                />
                {/* </ListItemAvatar> */}
                <ListItemText
                  primary={
                    <React.Fragment>
                      <Typography
                        sx={{
                          display: "inline",
                          fontSize: "14px",
                          fontWeight: "bold",
                        }}
                        component="span"
                        variant="body1"
                        color="text.primary"
                      >
                        {doctorDetail.doctor}
                      </Typography>
                    </React.Fragment>
                  }
                  secondary={
                    <React.Fragment>
                      <Typography
                        sx={{ display: "inline", fontSize: "14px" }}
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
                  sx={{
                    py: 1,
                    px: 3,
                    mr: 2,
                    justifyContent: "end",
                    fontSize: "12px",
                    padding: "5px",
                    margin: "0px",
                  }}
                  onClick={() =>
                    router.push(
                      `book-appointments?doctorId=${doctorDetail?.doctorId}&sessionId=${selectedSessionId}`
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
      )}
    </GenericModal>
  );
};

export default SuggestedDoctorModal;
