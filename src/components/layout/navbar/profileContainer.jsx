import * as React from "react";
import IconButton from "@mui/material/IconButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { Avatar, Divider, Grid, Menu, MenuItem } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsIcon from "@mui/icons-material/Notifications";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

import MuiTypography from "../../core/Typography";
import { Box, Button, GenericModal } from "../../core";
import { BeatLoader } from "react-spinners";
import { useGetAllOrGetByIdMutation } from "@/redux/slices/notofication";
import { Loader1 } from "@/components/core/Loader/Loader";
import { APPOINTMENT_STATUSES } from "@/config";
import { extractDateTimeComponents } from "@/lib/utils";
import moment from "moment";

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
const AptNotification = [
  {
    id: 1,
    status: "Appointment Rescheduled",
    iconColor: "#FF5E0E",
    bgColor: "#FEF2E6",
    day: "Today",
    message: "Your appointment is rescheduled to Mon 16, 2023 on 9:45 PM",
  },
  {
    id: 2,
    status: "Appointment Cancelled",
    iconColor: "#D64242",
    bgColor: "#FCE9E9",
    day: "Yesterday",
    message: "Appointment with Dr. Michael is cancelled",
  },
  {
    id: 3,
    status: "Appointment Rescheduled",
    iconColor: "#348AF4",
    bgColor: "#E7F1FE",
    day: "Today",
    message: "Your appointment is rescheduled to Mon 16, 2023 on 9:45 PM",
  },
  {
    id: 4,
    status: "Appointment Confirmed",
    iconColor: "#34C240",
    bgColor: "#E7F1FE",
    day: "09/1/22",
    message: "Eisa Malik sent you a new message",
  },
  {
    id: 5,
    status: "Upcoming Appointment",
    iconColor: "#348AF4",
    bgColor: "#E7F1FE",
    day: "09/1/22",
    message: "There is an upcoming appointment on monday",
  },
];

const StyledMenu = styled(Menu)`
  .MuiPaper-elevation {
    width: 245px;
    max-width: "100%";
    border-radius: 12px;
  }
  .MuiMenuItem-root:hover {
    background-color: #ffe0e0;
    color: #e02828;
  }
`;

const StyledNotification = styled.div`
  cursor: pointer;
`;
const ScrollContainer = styled(Box)`
  max-height: 60vh;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 0px;
    background: transparent; /* Chrome/Safari/Webkit */
  }
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;

const ProfileContainer = () => {
  const [open, setOpen] = React.useState(false);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [loading, setLoading] = React.useState(null);
  const router = useRouter();
  const session = useSession();
  const role = session?.data?.user?.user?.role || "";
  const filter = session?.data?.user?.user?.roleId || "";
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const [getAllOrGetById, { data, isLoading }] = useGetAllOrGetByIdMutation();

  console.log("session?.data?.user?.user", session?.data?.user?.user);
  React.useEffect(() => {
    async function fetchNotifications() {
      try {
        const payload =
          role === "Doctor"
            ? { doctorId: session?.data?.user?.user?.userId }
            : role === "Patient"
            ? { patientId: session?.data?.user?.user?.userId }
            : {};
        const reps = await getAllOrGetById(payload);
      } catch (error) {
        console.log(error);
      }
    }
    if (session) {
      fetchNotifications();
    }
  }, [session]);

  const sessionTimeOut = session.status;

  React.useEffect(() => {
    if (sessionTimeOut === "unauthenticated") {
      signOut();
    }
  }, [sessionTimeOut]);

  const handleCloseUserMenu = (setting) => {
    if (setting === "Logout") {
      setOpen(true);
      setAnchorElUser(null);
    } else if (setting === "My Profile") {
      if (role === "Patient") {
        router.push("/patient/my-profile");
      } else if (role === "Doctor") {
        router.push("/doctor/my-profile");
      }

      setAnchorElUser(null);
      return;
    } else {
      setAnchorElUser(null);
      return;
    }
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    signOut();
    try {
      setLoading(true);
      const res = await signOut();
      setOpen(false);
      setAnchorElUser(null);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  const settings = [];
  if (role !== "Admin") {
    settings.push({
      name: "My Profile",
      icon: <PersonOutlineIcon sx={{ fontSize: "22px" }} />,
    });
  }

  settings.push({
    name: "Logout",
    icon: <LogoutIcon sx={{ fontSize: "20px" }} />,
  });

  const [anchorEl, setAnchorEl] = React.useState(null);

  const open1 = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  // if (isLoading) {
  //   return (
  //     <>
  //       <Loader1 />
  //     </>
  //   );
  // }
  const getStatusColor = (statusId) => {
    switch (statusId) {
      case APPOINTMENT_STATUSES.MISSED:
        return "#FF5E0E";
      case APPOINTMENT_STATUSES.CANCELED:
        return "red";
      case APPOINTMENT_STATUSES.BOOKED:
        return "red";
      case APPOINTMENT_STATUSES.PENDING:
        return "yellow";
      case APPOINTMENT_STATUSES.COMPLETED:
        return "#34C240";
      case APPOINTMENT_STATUSES.REACHED:
        return "cyan";
      case APPOINTMENT_STATUSES.UPCOMING:
        return "#007bff";
      default:
        return "purple";
    }
  };

  const convertNotificationTime = (notification) => {
    try {
      if (typeof notification !== "string") {
        throw new Error("Notification is not a string");
      }

      const timeRegex = /at (\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})/;
      const match = notification.match(timeRegex);

      if (match) {
        const utcTime = match[1];

        const localTime = moment.utc(utcTime).local().format("hh:mm A"); // Shows time in 12-hour format with AM/PM

        return notification.replace(utcTime, localTime);
      }
      return notification;
    } catch (error) {
      console.error("Error converting notification time:", error);
      return notification;
    }
  };

  console.log("=====>", data);
  return (
    <>
      <Box
        sx={{ flexGrow: 0 }}
        display="flex"
        justifyContent="flex-end"
        alignItems="center"
      >
        <StyledNotification>
          <Box
            sx={{ display: "flex", alignItems: "center", textAlign: "center" }}
          >
            <NotificationsIcon
              fontSize="large"
              sx={{ color: "#4D4D4D" }}
              onClick={handleClick}
              aria-controls={open1 ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open1 ? "true" : undefined}
            />
            {AptNotification.length > 0 && (
              <FiberManualRecordIcon
                sx={{
                  fontSize: "18px",
                  color: "#E02828",
                  position: "relative",
                  bottom: "8px",
                  right: "18px",
                }}
                onClick={handleClick}
              />
            )}
          </Box>
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open1}
            onClose={handleClose}
            onClick={handleClose}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            PaperProps={{
              elevation: 0,
              sx: {
                py: 1,
                px: 2,
                borderRadius: "16px",
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px #00000029)",
                mt: 1.5,
                width: 560,
                maxWidth: "100%",
              },
            }}
          >
            {isLoading ? (
              <Loader1 />
            ) : (
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  // overflowY: "hidden !important",
                }}
              >
                <Box display="flex" justifyContent="space-between">
                  <MuiTypography
                    align="left"
                    component="div"
                    variant="h6"
                    color="#000"
                    fontWeight="600"
                  >
                    Notifications
                  </MuiTypography>
                  {/* {AptNotification.length > 0 && (
                    <MuiTypography
                      align="left"
                      component="div"
                      variant="p"
                      color="#E02828"
                      display="flex"
                      alignItems="center"
                      fontWeight="500"
                    >
                      Mark all as read
                      <CheckCircleOutlineIcon
                        sx={{ marginLeft: "6px", fontSize: "18px" }}
                      />
                    </MuiTypography>
                  )} */}
                </Box>
                <ScrollContainer>
                  {data?.data?.length > 0 ? (
                    data?.data?.map((item, index) => {
                      const { date: startDate } = extractDateTimeComponents(
                        item.startDateTime
                      );
                      const { date: createdAtDate } = extractDateTimeComponents(
                        item.createAt
                      );
                      const date = item.startDateTime
                        ? startDate
                        : createdAtDate;
                      return (
                        <div key={index}>
                          <MenuItem
                            onClick={handleClose}
                            sx={{ padding: "14px 0px" }}
                          >
                            <Box display="flex" alignItems="center">
                              <Box
                                display="flex"
                                width="auto"
                                borderRadius="50%"
                                sx={{
                                  background: getStatusColor(item.statusId),
                                  marginRight: "10px",
                                }}
                              >
                                <CalendarTodayIcon
                                  sx={{
                                    color: `white`,
                                    padding: "8px",
                                  }}
                                />
                              </Box>
                              <Box>
                                <Box
                                  display="flex"
                                  justifyContent="space-between"
                                >
                                  <MuiTypography
                                    fontWeight="600"
                                    component="p"
                                    variant="body2"
                                  >
                                    {item?.status || "Request"}
                                  </MuiTypography>
                                  <MuiTypography
                                    component="div"
                                    variant="body2"
                                    color="#999999"
                                  >
                                    {moment(date).format("MM/DD/YY") || "N/A"}
                                  </MuiTypography>
                                </Box>
                                <MuiTypography
                                  component="div"
                                  variant="body2"
                                  color="#999999"
                                >
                                  {convertNotificationTime(
                                    item?.notification
                                  ) || ""}
                                </MuiTypography>
                              </Box>
                            </Box>
                          </MenuItem>
                          {index < AptNotification.length - 1 && <Divider />}
                        </div>
                      );
                    })
                  ) : (
                    <Box padding="20px">
                      <MuiTypography
                        component="h6"
                        variant="h6"
                        color="#999999"
                        sx={{ textAlign: "center" }}
                      >
                        No Notification
                      </MuiTypography>
                    </Box>
                  )}
                </ScrollContainer>
              </Box>
            )}
          </Menu>
        </StyledNotification>

        <IconButton
          disableRipple={true}
          size="large"
          aria-label="account of current user"
          aria-haspopup="true"
          onClick={handleOpenUserMenu}
          color="inherit"
        >
          <Avatar
            alt={session?.data?.user?.user?.name || "Remy Sharp"}
            src={session?.data?.user?.user?.profilePicture}
          />
          <Box display="flex" alignItems="center">
            <Box mx="10px" sx={{ display: { xs: "none", sm: "block" } }}>
              <MuiTypography
                align="left"
                component="div"
                variant="body1"
                fontWeight="bold"
                color="#000"
              >
                {session?.data?.user?.user?.name || ""}
              </MuiTypography>
              <MuiTypography
                align="left"
                component="div"
                variant="body2"
                color="#000"
              >
                {session?.data?.user?.user?.role || ""}
              </MuiTypography>
            </Box>
            {anchorElUser ? (
              <ExpandMoreIcon fontSize="large" style={{ color: "#000000" }} />
            ) : (
              <ExpandLessIcon fontSize="large" style={{ color: "#000000" }} />
            )}
          </Box>
        </IconButton>
        <StyledMenu
          sx={{ mt: "45px" }}
          id="menu-appbar"
          anchorEl={anchorElUser}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={anchorElUser}
          onClose={handleCloseUserMenu}
        >
          {settings.map((setting) => (
            <MenuItem
              key={setting}
              onClick={() => handleCloseUserMenu(setting?.name)}
            >
              {setting?.icon}
              <MuiTypography
                variant="subtitle1"
                fontWeight="400"
                component="span"
                ml={0.5}
                lineHeight="normal"
              >
                {setting?.name}
              </MuiTypography>
            </MenuItem>
          ))}
        </StyledMenu>
      </Box>
      {open && (
        <GenericModal show={open} onHide={() => setOpen(false)} size="sm">
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
                Logout
              </MuiTypography>
              <MuiTypography
                variant="h6"
                component="h6"
                fontWeight="400"
                sx={{ mt: 2 }}
              >
                Are you sure you want to Logout?
              </MuiTypography>
            </Box>
            <Box display="flex" justifyContent="center">
              <StyledButton
                sx={{ py: 1, px: 3, mr: 2 }}
                disabled={loading ? true : false}
                onClick={handleLogout}
              >
                {loading ? <BeatLoader color="#fff" size="10px" /> : "Yes"}
              </StyledButton>
              <CancelButton
                sx={{ py: 1, px: 3 }}
                onClick={() => setOpen(false)}
              >
                No
              </CancelButton>
            </Box>
          </Grid>
        </GenericModal>
      )}
    </>
  );
};

export default ProfileContainer;
