"use client";

import { useEffect, useState } from "react";
import {
  Avatar,
  Grid,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
} from "@mui/material";
import styled from "styled-components";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Search } from "@mui/icons-material";
import { TimePicker } from "@mui/x-date-pickers";
// import DashboardLayout from "@/components/layout";
import { Box, Button, GenericModal } from "@/components";
import MuiTypography from "@/components/core/Typography";
import InputField from "@/components/core/Input";
import Table from "@/components/core/Table";
import Pagination from "@/components/core/Pagination";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import DatePicker from "@/components/core/DatePicker";
import { useRouter } from "next/navigation";
import useScreenWidth from "@/hooks/useScreenWidth";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useGetAllAppointmentsMutation } from "@/redux/slices/appointments";
import { Loader1 } from "@/components/core/Loader/Loader";
import dayjs from "dayjs";
import { APPOINTMENT_STATUSES } from "@/config";
import { useSession } from "next-auth/react";
import {
  ReturnCurrentTime,
  convertDateToISOFormat,
  convertToUTCDate,
  extractDateTimeComponents,
} from "@/lib/utils";
import moment from "moment";
import PatientAssessment from "@/components/webComponent/patientAssessment";
import DateRangePickerComp from "@/components/webComponent/DateRangePicker";
import ChatHistoryDrawer from "../patient-management/chatHistoryDrawer";

const StyledPagination = styled.div`
  @media (max-width: 669px) {
    width: 100%;
    display: flex;
    justify-content: end;
  }
`;
const StyledTimePicker = styled(TimePicker)`
  height: 40px;
  && {
    margin: 0px 10px;
  }
  .MuiInputBase-root {
    width: 140px;
    height: 100%;
  }
  .MuiOutlinedInput-notchedOutline {
    border: 1px solid #e5e6e6 !important;
    border-radius: 6px;
  }
  input {
    font-size: 14px;
  }
`;

const INPUT_FIELD_PROPS_SEARCH = {
  label: "",
  fullWidth: true,
  variant: "standard",
};

const INPUT_FIELD_STYLES_SEARCH = {
  sx: {
    margin: "10px 0px",
    width: "200px",
    height: "40px",
    paddingLeft: "10px",
    marginLeft: "10px",
    "& fieldset": { border: "1px solid #E2E5ED" },
  },
};

const BUTTON_FILTER = {
  variant: "contain",
  radius: "40px",
  height: "30px",
};

const BUTTON_FILTER_XS = {
  sx: {
    padding: 0,
    fontSize: "14px",
    px: "15px",
    mr: 1,
    my: 1,
  },
};

export default function Appointments() {
  const screenWidth = useScreenWidth();
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState(null);
  const [userType, setUserType] = useState("patient");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [viewMeetings, setViewMeetings] = useState(false);
  const [rowId, setRowId] = useState("");
  const [rowData, setRowData] = useState(null);
  console.log("setRowDatasetRowData", rowData);
  const session = useSession();
  const router = useRouter();
  const [
    getAllAppointments,
    { isLoading, isError, isSuccess, data: appointmentData, error },
  ] = useGetAllAppointmentsMutation();

  const [dateRange, setDateRange] = useState({
    endDateISO: null,
    startDateISO: null,
  });

  let userID = session?.data?.user?.user?.userId;

  useEffect(() => {
    const fetchData = async () => {
      await getAllAppointments({
        userId: userID,
        pageNo: currentPage,
        pageSize: 10,
        statusId: filter,
        startDate: dateRange?.startDateISO || null,
        endDate: convertToUTCDate(dateRange?.endDateISO) || null,
        startDate: convertToUTCDate(dateRange?.startDateISO) || null,
      });
    };
    fetchData();
  }, [currentPage, userID, filter, startDate, searchValue]);

  const onSearchHandler = (e) => {
    setSearchValue(e.target.value);
    if (e.target.value.length > 3 || e.target.value.length === 0) {
      const payload = {
        userId: userID,
        pageNo: currentPage,
        pageSize: 10,
        search: e.target.value,
        statusId: filter,
        endDate: convertToUTCDate(dateRange?.endDateISO) || null,
        startDate: convertToUTCDate(dateRange?.startDateISO) || null,
      };

      getAllAppointments(payload);
    }
  };

  // const onDateSearchHandler = (date) => {
  //   if (date) {
  //     setStartDate(convertDateToISOFormat(date));
  //     const payload = {
  //       userId: userID,
  //       pageNo: currentPage,
  //       pageSize: 10,
  //       date: convertDateToISOFormat(date),
  //       statusId: filter,
  //     };
  //     getAllAppointments(payload);
  //   }
  // };
  const handleDateChange = (start, end) => {
    console.log("start, end:", start, end);

    const startDateISO = start ? start.toISOString() : null;
    const endDateISO = end ? end.toISOString() : null;
    setDateRange({ endDateISO, startDateISO });
    const payload = {
      pageNo: currentPage,
      pageSize: 10,
      userId: userID,
      startDate: convertToUTCDate(startDateISO),
      endDate: convertToUTCDate(endDateISO),
    };

    console.log("payload:::", payload);

    getAllAppointments(payload);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const [detailsOpen, setDetailsOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setDetailsOpen(open);
  };
  return (
    <div>
      {/* <DashboardLayout> */}
      <Grid container spacing={3}>
        <Grid
          item
          xs={12}
          lg={detailsOpen === true && screenWidth >= 1400 ? 8 : 12}
        >
          <Box
            bgcolor="#fff"
            boxShadow="0px 0px 24px 0px rgba(0, 0, 0, 0.04)"
            width="100%"
            borderRadius="12px"
          >
            <Box p="20px">
              <Box>
                <MuiTypography variant="h6" component="h6" fontWeight="600">
                  Appointments
                </MuiTypography>
              </Box>

              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                flexWrap="wrap"
              >
                <Box width="auto">
                  <Button
                    onClick={() => {
                      setFilter(null);
                      setCurrentPage(1);
                      // setSearchValue("");
                    }}
                    sx={BUTTON_FILTER_XS.sx}
                    {...BUTTON_FILTER}
                    bg={`${filter === null ? "#348AF4" : "#F2F3F2"}`}
                    color={`${filter === null ? "#fff" : "#636967"}`}
                  >
                    All
                  </Button>

                  {/* <Button
                    onClick={() => {
                      setFilter(APPOINTMENT_STATUSES.UPCOMING);
                      setCurrentPage(1);
                      setSearchValue("");
                    }}
                    sx={BUTTON_FILTER_XS.sx}
                    {...BUTTON_FILTER}
                    bg={`${
                      filter === APPOINTMENT_STATUSES.UPCOMING
                        ? "#348AF4"
                        : "#F2F3F2"
                    }`}
                    color={`${
                      filter === APPOINTMENT_STATUSES.UPCOMING
                        ? "#fff"
                        : "#636967"
                    }`}
                  >
                    Upcoming
                  </Button> */}

                  <Button
                    onClick={() => {
                      setFilter(APPOINTMENT_STATUSES.MISSED);
                      setCurrentPage(1);
                      // setSearchValue("");
                    }}
                    sx={BUTTON_FILTER_XS.sx}
                    {...BUTTON_FILTER}
                    bg={`${
                      filter === APPOINTMENT_STATUSES.MISSED
                        ? "#348AF4"
                        : "#F2F3F2"
                    }`}
                    color={`${
                      filter === APPOINTMENT_STATUSES.MISSED
                        ? "#fff"
                        : "#636967"
                    }`}
                  >
                    Missed
                  </Button>
                  <Button
                    onClick={() => {
                      setFilter(APPOINTMENT_STATUSES.COMPLETED);
                      setCurrentPage(1);
                      // setSearchValue("");
                    }}
                    sx={BUTTON_FILTER_XS.sx}
                    {...BUTTON_FILTER}
                    bg={`${
                      filter === APPOINTMENT_STATUSES.COMPLETED
                        ? "#348AF4"
                        : "#F2F3F2"
                    }`}
                    color={`${
                      filter === APPOINTMENT_STATUSES.COMPLETED
                        ? "#fff"
                        : "#636967"
                    }`}
                  >
                    Completed
                  </Button>

                  <Button
                    onClick={() => {
                      setFilter(APPOINTMENT_STATUSES.BOOKED);
                      setCurrentPage(1);
                      // setSearchValue("");
                    }}
                    sx={BUTTON_FILTER_XS.sx}
                    {...BUTTON_FILTER}
                    bg={`${
                      filter === APPOINTMENT_STATUSES.BOOKED
                        ? "#348AF4"
                        : "#F2F3F2"
                    }`}
                    color={`${
                      filter === APPOINTMENT_STATUSES.BOOKED
                        ? "#fff"
                        : "#636967"
                    }`}
                  >
                    Booked
                  </Button>
                </Box>

                <Box
                  display="flex"
                  flexWrap="wrap"
                  justifyContent="flex-end"
                  alignItems="center"
                  boxSizing="border-box"
                  width="auto"
                  sx={{
                    display: { xs: "none", sm: "flex" },
                    marginLeft: "auto",
                  }}
                >
                  {/* <StyledTimePicker /> */}
                  {/* <DatePicker
                    height="40px"
                    width="160px"
                    border="1px solid #e5e6e6"
                    radius="6px"
                    fsize="14px"
                    selected={dayjs(new Date())}
                    onChange={onDateSearchHandler}
                  /> */}
                  <DateRangePickerComp onDateChange={handleDateChange} />
                  <InputField
                    id="email"
                    placeholder="Search"
                    {...INPUT_FIELD_PROPS_SEARCH}
                    sx={INPUT_FIELD_STYLES_SEARCH.sx}
                    variant="standard"
                    value={searchValue}
                    onChange={onSearchHandler}
                    startAdornment={
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    }
                  />
                </Box>
              </Box>
            </Box>

            <TabelComponent
              detailsOpen={detailsOpen}
              setDetailsOpen={setDetailsOpen}
              isLoading={isLoading}
              appointmentData={appointmentData}
              router={router}
              setViewMeetings={setViewMeetings}
              setRowData={setRowData}
              setRowId={setRowId}
              rowId={rowId}
              rowData={rowData}
            />
            <Box
              display="flex"
              flexWrap="wrap"
              justifyContent="space-between"
              pb="20px"
              px="20px"
              sx={{ boxSizing: "border-box" }}
            >
              <MuiTypography
                variant="span"
                component="span"
                color="#1C1D21"
                fontWeight="400"
              >
                {currentPage} to {appointmentData?.data?.length}{" "}
                <span style={{ color: "#666666" }}>out of </span>
                {appointmentData?.totalCounts || 0} entries
              </MuiTypography>
              <StyledPagination>
                <Pagination
                  count={Math.ceil(appointmentData?.totalCounts / 10)}
                  onPageChange={handlePageChange}
                />
              </StyledPagination>
            </Box>
          </Box>
        </Grid>
        {viewMeetings && (
          <GenericModal
            show={viewMeetings}
            onHide={() => setViewMeetings(false)}
            size="lg"
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
                  sx={{ mb: 3 }}
                >
                  Patient Assessments
                </MuiTypography>
                {/* <MuiTypography
                  variant="h6"
                  component="h6"
                  fontWeight="400"
                  sx={{ my: 3 }}
                >
                  Are you sure you want to Reschedule Slots
                </MuiTypography> */}

                <Grid container spacing={3}>
                  <PatientAssessment hideActions={true} rowData={rowData} />
                </Grid>
              </Box>
            </Grid>
          </GenericModal>
        )}
      </Grid>
      {/* </DashboardLayout> */}
    </div>
  );
}

const StyledMenu = styled(Menu)`
  box-shadow: 0px 4px 15px 0px rgba(0, 0, 0, 0.16);

  && {
    .MuiPaper-elevation {
      min-width: 216px;
      border-radius: 12px;
    }
    .MuiMenu-list li:hover {
      background: #fce9e9;
      color: #e02828;
    }
  }
`;

const TabelComponent = ({
  setDetailsOpen,
  detailsOpen,
  appointmentData,
  isLoading,
  router,
  setViewMeetings,
  setRowData,
  setRowId,
  rowId,
  rowData,
}) => {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [drawerState, setDrawerState] = useState({ right: false });

  const toggleDrawer = (anchor, open) => (event) => {
    setAnchorElUser(null);

    // Check if event is defined and has the type property
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setDrawerState((prevState) => ({ ...prevState, [anchor]: open }));
  };

  const handleButtonClick = (cell) => {
    // debugger;
    setRowId(cell.row.original);
    toggleDrawer("right", true)(); // Immediately invoke the function with true to open
  };

  const handleOpenUserMenu = (event) => {
    event.stopPropagation();
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleViewMeetings = () => {
    setViewMeetings(true);
  };

  const columns = (router) => [
    {
      header: "Patients",
      accessorKey: "patients",
      Cell: ({ cell }) => (
        <Box display="flex" alignItems="center">
          <MuiTypography variant="body2" component="span" sx={{ mx: "10px" }}>
            {cell.row.original.patient}
          </MuiTypography>
        </Box>
      ),
    },
    {
      header: "Doctors",
      accessorKey: "doctor",
    },
    {
      header: "Appt Date",
      accessorKey: "aptDate",
      accessorFn: (row) => {
        const { date } = extractDateTimeComponents(row?.startDateTime);
        return <div>{moment(date).format("MM/DD/YY")}</div>;
      },
    },
    {
      header: "Appointment Time",
      accessorKey: "aptTime",
      accessorFn: (row) => {
        const { time } = extractDateTimeComponents(row?.startDateTime);
        return <div>{moment.utc(row?.startDateTime).local().format("LT")}</div>;
      },
    },
    {
      header: "Appt Fee",
      accessorKey: "amount",
      accessorFn: (row) => {
        return <div>$ {Number(row?.amount) }</div>;
      },
    },
    {
      header: "Status",
      accessorKey: "status",
      accessorFn: (row) => {
        const { startDateTime, endDateTime, status, statusId } = row;

        const slotStartTimeLocal = moment
          .utc(startDateTime)
          .local()
          .format("HH:mm:ss");
        const slotEndTimeLocal = moment
          .utc(endDateTime)
          .local()
          .format("HH:mm:ss");

        let currentTimeCheck = ReturnCurrentTime();
        const currentDate = new Date().toISOString().split("T")[0];
        const { date } = extractDateTimeComponents(startDateTime);
        if (statusId === APPOINTMENT_STATUSES.COMPLETED) {
          return (
            <div style={{ display: "flex", alignItems: "center" }}>
              <FiberManualRecordIcon
                sx={{ color: "#6c757d", marginRight: "5px", fontSize: "12px" }}
              />
              <p>{status}</p>
            </div>
          );
        }
        if (
          currentTimeCheck >= slotStartTimeLocal &&
          currentTimeCheck <= slotEndTimeLocal &&
          currentDate === date
        ) {
          return (
            <div style={{ display: "flex", alignItems: "center" }}>
              <Button
                onClick={() => {
                  router.push(`/tele-communication/${row?.appointmentId}`);
                }}
                variant="contain"
                bg={"red"}
                color="#fff"
                width="45px"
                height="45px"
              >
                Join
              </Button>
            </div>
          );
        } else {
          return (
            <div style={{ display: "flex", alignItems: "center" }}>
              <FiberManualRecordIcon
                sx={{ color: "#6c757d", marginRight: "5px", fontSize: "12px" }}
              />
              <p>{status}</p>
            </div>
          );
        }
      },
    },
  ];

  if (isLoading) {
    return <Loader1 />;
  }
  console.log("::::::rowId",rowId);
  return (
    <>
      <Table
        columns={columns(router)}
        data={appointmentData?.data || []}
        enableRowSelection={false}
        // enableRowActions={false}
        renderRowActions={({ row, cell }) => (
          <>
            <IconButton
              disableRipple={true}
              size="large"
              aria-label="account of current user"
              aria-haspopup="true"
              onClick={(event) => {
                setRowData(row?.original);
                setRowId(row?.original)
                handleOpenUserMenu(event);
              }}
              role="button"
              tabIndex="0"
              onKeyDown={(e) => {
                e.stopPropagation();
              }}
              color="inherit"
            >
              <MoreVertIcon />
         
            </IconButton>
          </>
        )}
        muiTableBodyRowProps={({ row }) => ({
          onClick: () => {
            setDetailsOpen(false);
          },
          sx: {
            cursor: "pointer",
          },
        })}
      />
           <StyledMenu
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "bottom",
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
                {/* <MenuItem
                  onClick={(event) => {
                    // setRowId(cell?.row?.original);
                    handleOpenUserMenu(event);
                  }}
                >
                  <MuiTypography
                    textAlign="center"
                    display="flex"
                    alignItems="center"
                  >
                    <VisibilityIcon
                      sx={{ color: "#000000", marginRight: "5px" }}
                    />
                    View
                  </MuiTypography>
                </MenuItem> */}
                {/* {rowData?.chatSessionId && ( */}
                  <MenuItem
                    onClick={() => {
                      // handleButtonClick(cell);
                      toggleDrawer("right", true)();
                      handleCloseUserMenu();
                    }}
                  >
                    <VisibilityIcon sx={{ fontSize: "20px" }} />
                    <MuiTypography
                      variant="subtitle1"
                      fontWeight="400"
                      component="span"
                      ml={0.5}
                    >
                      Ai Chat History
                    </MuiTypography>
                  </MenuItem>
                {/* )} */}
              </StyledMenu>

      <ChatHistoryDrawer
        state={drawerState}
        toggleDrawer={toggleDrawer}
        rowId={rowId}
        setRowId={setRowId}
      />
    </>
  );
};

// const columns = (router) => [
//   {
//     header: "Patients",
//     accessorKey: "patients",
//     Cell: ({ cell }) => (
//       <Box display="flex" alignItems="center">
//         <MuiTypography variant="body2" component="span" sx={{ mx: "10px" }}>
//           {cell.row.original.patient}
//         </MuiTypography>
//       </Box>
//     ),
//   },
//   {
//     header: "Doctors",
//     accessorKey: "doctor",
//   },
//   {
//     header: "Appt Date",
//     accessorKey: "aptDate",
//     accessorFn: (row) => {
//       const { date } = extractDateTimeComponents(row?.startDateTime);
//       return <div>{moment(date).format("MM/DD/YY")}</div>;
//     },
//   },
//   {
//     header: "Appointment Time",
//     accessorKey: "aptTime",
//     accessorFn: (row) => {
//       const { time } = extractDateTimeComponents(row?.startDateTime);
//       return <div>{moment.utc(row?.startDateTime).local().format("LT")}</div>;
//     },
//   },
//   {
//     header: "Appt Fee",
//     accessorKey: "amount",
//     accessorFn: (row) => {
//       return <div>$ {row.amount}</div>;
//     },
//   },
//   {
//     header: "Status",
//     accessorKey: "status",
//     accessorFn: (row) => {
//       const { startDateTime, endDateTime, status, statusId } = row;

//       const slotStartTimeLocal = moment
//         .utc(startDateTime)
//         .local()
//         .format("HH:mm:ss");
//       const slotEndTimeLocal = moment
//         .utc(endDateTime)
//         .local()
//         .format("HH:mm:ss");

//       let currentTimeCheck = ReturnCurrentTime();
//       const currentDate = new Date().toISOString().split("T")[0];
//       const { date } = extractDateTimeComponents(startDateTime);
//       if (statusId === APPOINTMENT_STATUSES.COMPLETED) {
//         return (
//           <div style={{ display: "flex", alignItems: "center" }}>
//             <FiberManualRecordIcon
//               sx={{ color: "#6c757d", marginRight: "5px", fontSize: "12px" }}
//             />
//             <p>{status}</p>
//           </div>
//         );
//       }
//       if (
//         currentTimeCheck >= slotStartTimeLocal &&
//         currentTimeCheck <= slotEndTimeLocal &&
//         currentDate === date
//       ) {
//         return (
//           <div style={{ display: "flex", alignItems: "center" }}>
//             <Button
//               onClick={() => {
//                 router.push(`/tele-communication/${row?.appointmentId}`);
//               }}
//               variant="contain"
//               bg={"red"}
//               color="#fff"
//               width="45px"
//               height="45px"
//             >
//               Join
//             </Button>
//           </div>
//         );
//       } else {
//         return (
//           <div style={{ display: "flex", alignItems: "center" }}>
//             <FiberManualRecordIcon
//               sx={{ color: "#6c757d", marginRight: "5px", fontSize: "12px" }}
//             />
//             <p>{status}</p>
//           </div>
//         );
//       }
//     },
//   },
// ];
