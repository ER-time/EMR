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
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Search } from "@mui/icons-material";
import { TimePicker } from "@mui/x-date-pickers";
import styled from "styled-components";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useRouter } from "next/navigation";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Box, Button, GenericModal } from "@/components";
import MuiTypography from "@/components/core/Typography";
import InputField from "@/components/core/Input";
import Table from "@/components/core/Table";
import Pagination from "@/components/core/Pagination";
import DatePicker from "@/components/core/DatePicker";
import { CalendarView, DeleteModal } from "@/components/webComponent";
import GridViewIcon from "@mui/icons-material/GridView";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import {
  useGetAllAppointmentsMutation,
  useRescheduleAppointmentMutation,
} from "@/redux/slices/appointments";
import { useSession } from "next-auth/react";
import { LoaderTable } from "@/components/core/Loader/Loader";
import {
  ReturnCurrentTime,
  convertDateToISOFormat,
  convertToUTCDate,
  dateToUtcFormat,
  extractDateTimeComponents,
} from "@/lib/utils";
import { APPOINTMENT_STATUSES } from "@/config";
import moment from "moment";
import dayjs from "dayjs";
import { BeatLoader } from "react-spinners";
import { useGetDoctorSlotsQuery } from "@/redux/slices/sloting";
import HorizontalCalendar from "../book-appointments/parts/horizontalCalendar";
import { onFailure, onSuccess } from "@/redux/features/apiStatusSlice";
import { useDispatch } from "react-redux";
import PatientAssessment from "@/components/webComponent/patientAssessment";
import DateRangePickerComp from "@/components/webComponent/DateRangePicker";

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

const StyledPagination = styled.div`
  @media (max-width: 669px) {
    width: 100%;
    display: flex;
    justify-content: end;
  }
`;

const StyledBox = styled(Box)`
  @media (max-width: 473px) {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
`;

export default function MyAppointments() {
  const [filter, setFilter] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState(null);
  const [showType, setShowType] = useState("LIST");
  const [searchValue, setSearchValue] = useState("");
  const [rowData, setRowData] = useState(null);
  const [selectSingleButton, setSelectSingleButton] = useState(null);
  const [open, setOpen] = useState(false);
  const [viewMeetings, setViewMeetings] = useState(false);
  const [activeDate, setActiveDate] = useState(new Date());
  const session = useSession();
  const dispatch = useDispatch();
  const router = useRouter();

  const [dateRange, setDateRange] = useState({
    endDateISO: null,
    startDateISO: null,
  });

  const [
    getAllAppointments,
    { isLoading, isError, isSuccess, data: appointmentData, error },
  ] = useGetAllAppointmentsMutation();
  const doctorSlots = useGetDoctorSlotsQuery({
    doctorId: rowData?.doctorId || 0,
    date: moment(activeDate).format("YYYY-MM-DD"),
  });
  const [
    rescheduleAppointment,
    {
      data: rescheduleAppointments,
      isLoading: appointmentLoading,
      isError: appointmentError,
      isSuccess: appointmentSucess,
    },
  ] = useRescheduleAppointmentMutation();
  const changeLayoutTypeHandler = (arg) => {
    setShowType(arg);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  let userID = session?.data?.user?.user?.userId;

  useEffect(() => {
    const fetchData = async () => {
      await getAllAppointments({
        userId: userID,
        pageNo: currentPage,
        pageSize: 10,
        statusId: filter,
        endDate: convertToUTCDate(dateRange?.endDateISO) || null,
        startDate: convertToUTCDate(dateRange?.startDateISO) || null,
        search: searchValue,
      });
    };
    fetchData();
  }, [currentPage, filter, userID, searchValue, startDate]);
  const onSearchHandler = (e) => {
    setSearchValue(e.target.value);
    if (e.target.value.length > 3 || e.target.value.length === 0) {
      const payload = {
        pageNo: currentPage,
        pageSize: 10,
        search: e.target.value,
        statusId: filter,
        userId: userID,
        endDate: convertToUTCDate(dateRange?.endDateISO) || null,
        startDate: convertToUTCDate(dateRange?.startDateISO) || null,
      };

      getAllAppointments(payload);
    }
  };

  console.log("dateRange::::", dateRange);
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

  const updateAppointment = async () => {
    try {
      let finalPayload = {
        appointmentId: rowData?.appointmentId,
        startDateTime:
          selectSingleButton?.startDateTime ||
          moment(new Date()).format("YYYY-MM-DD"),
        endDateTime:
          selectSingleButton?.endDateTime ||
          moment(new Date()).format("YYYY-MM-DD"),
      };
      const resp = await rescheduleAppointment(finalPayload).unwrap();

      if (resp?.succeeded === true) {
        dispatch(
          onSuccess({
            message: resp?.message || "Success",
          })
        );
        setOpen(false);
        // router.push("/patient/my-appointments");
      } else {
        dispatch(
          onFailure({
            message: resp?.message || "Failure",
          })
        );
      }
    } catch (e) {
      dispatch(
        onFailure({
          message: e.message || "Failure",
        })
      );
      console.log("Error:", e);
    }
  };

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box
            bgcolor="#fff"
            boxShadow="0px 0px 24px 0px rgba(0, 0, 0, 0.04)"
            width="100%"
            borderRadius="12px"
          >
            <Box p="20px">
              <Box display="flex" justifyContent="space-between">
                <MuiTypography variant="h6" component="h6" fontWeight="600">
                  Appointments
                </MuiTypography>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="flex-end"
                  sx={{ flex: 1 }}
                >
                  <Box
                    backgroundColor={`${
                      showType === "GRID" ? "#348AF4" : "#E7F1FE"
                    }`}
                    width="36px"
                    height="36px"
                    mr={1}
                    borderRadius="5px"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    onClick={() => changeLayoutTypeHandler("GRID")}
                  >
                    <GridViewIcon
                      sx={{
                        cursor: "pointer",
                        color: showType === "GRID" ? "#fff" : "#348AF4",
                        fontSize: "25px",
                      }}
                    />
                  </Box>
                  <Box
                    backgroundColor={`${
                      showType === "LIST" ? "#348AF4" : "#E7F1FE"
                    }`}
                    width="36px"
                    height="36px"
                    borderRadius="5px"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    onClick={() => changeLayoutTypeHandler("LIST")}
                  >
                    <FormatListBulletedIcon
                      sx={{
                        cursor: "pointer",
                        color: showType === "LIST" ? "#fff" : "#348AF4",
                        fontSize: "30px",
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
            {showType === "GRID" ? (
              <CalendarView />
            ) : (
              <Box px="20px">
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
                      display: { xs: "flex", sm: "flex" },
                      marginLeft: "auto",
                      // flex:2
                    }}
                  >
                    {/* <StyledTimePicker /> */}

                    {/* <DatePicker
                      height="40px"
                      width="160px"
                      border="1px solid #e5e6e6"
                      radius="6px"
                      fsize="14px"
                      defaultValue={dayjs(new Date())}
                      selected={selectedDate}
                      onChange={onDateSearchHandler}
                    /> */}

                    {/* <DatePicker
                      height="40px"
                      width="160px"
                      border="1px solid #e5e6e6"
                      radius="6px"
                      fsize="14px"
                      selected={dayjs(new Date())}
                      onChange={onDateSearchHandler}
                    /> */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        // backgroundColor: "red",
                        width: "100%",
                        justifyContent: "end",
                      }}
                    >
                      <DateRangePickerComp onDateChange={handleDateChange} />
                      <InputField
                        id="search"
                        placeholder="Search"
                        value={searchValue}
                        onChange={onSearchHandler}
                        {...INPUT_FIELD_PROPS_SEARCH}
                        sx={INPUT_FIELD_STYLES_SEARCH.sx}
                        ml={3}
                        variant="standard"
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
                  router={router}
                  appointmentsData={appointmentData}
                  isLoading={isLoading}
                  setRowData={setRowData}
                  rowData={rowData}
                  setOpen={setOpen}
                  setViewMeetings={setViewMeetings}
                />
                <StyledBox
                  display="flex"
                  justifyContent="space-between"
                  pb="20px"
                  px="20px"
                  sx={{ boxSizing: "border-box" }}
                  flexWrap="wrap"
                >
                  <MuiTypography
                    variant="span"
                    component="span"
                    color="#1C1D21"
                    fontWeight="400"
                    margin="auto 0"
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
                </StyledBox>
              </Box>
            )}
          </Box>
        </Grid>
        {open && (
          <GenericModal show={open} onHide={() => setOpen(false)} size="lg">
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
                  Reschedule
                </MuiTypography>
                <MuiTypography
                  variant="h6"
                  component="h6"
                  fontWeight="400"
                  sx={{ mt: 2 }}
                >
                  Are you sure you want to Reschedule Slots
                </MuiTypography>
                <HorizontalCalendar
                  activeDate={activeDate}
                  setActiveDate={setActiveDate}
                  appointedDoctorId={rowData?.doctorId}
                />
                <Grid container spacing={3}>
                  {doctorSlots?.data?.data?.length > 0 ? (
                    doctorSlots?.data?.data?.map((slotItem) => (
                      <Grid
                        key={slotItem.doctorId}
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={3}
                      >
                        <SingleSlotButton
                          onClickFunc={() => setSelectSingleButton(slotItem)}
                          slotItem={slotItem}
                          selectSingleButton={selectSingleButton}
                        />
                      </Grid>
                    ))
                  ) : (
                    <MuiTypography
                      style={{
                        display: "block",
                        textAlign: "center",
                        margin: "30px auto",
                      }}
                    >
                      No Slots Available
                    </MuiTypography>
                  )}
                </Grid>
              </Box>
              {doctorSlots &&
                doctorSlots?.data &&
                doctorSlots?.data?.data?.length !== 0 && (
                  <Box display="flex" justifyContent="center">
                    <StyledButton
                      sx={{ py: 1, px: 3, mr: 2 }}
                      // disabled={loading ? true : false}
                      onClick={updateAppointment}
                    >
                      Yes
                    </StyledButton>
                    <CancelButton
                      sx={{ py: 1, px: 3 }}
                      onClick={() => setOpen(false)}
                    >
                      No
                    </CancelButton>
                  </Box>
                )}
            </Grid>
          </GenericModal>
        )}
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
    </div>
  );
}

const StyledMenu = styled(Menu)`
  box-shadow: 0px 4px 15px 0px rgba(0, 0, 0, 0.16);

  && {
    .MuiPaper-elevation {
      min-width: 216px;
    }
    .MuiMenu-list li:hover {
      background: #fce9e9;
      color: #e02828;
      svg {
        color: #e02828;
      }
    }
  }
`;
const SingleSlotButton = ({ slotItem, selectSingleButton, onClickFunc }) => {
  const slotStartTime = moment
    .utc(slotItem?.startDateTime)
    .format("YYYY-MM-DD HH:mm:ss");

  var slotStartTimeStill = moment.utc(slotStartTime).toDate();
  var slotStartTimeLocal = moment(slotStartTimeStill).local().format("LT");

  const slotEndTime = moment
    .utc(slotItem?.endDateTime)
    .format("YYYY-MM-DD HH:mm:ss");

  var slotEndTimeStill = moment.utc(slotEndTime).toDate();
  var slotEndTimeLocal = moment(slotEndTimeStill).local().format("LT");
  return (
    <Button
      disabled={slotItem.status === "Booked"}
      key={slotItem.id}
      variant="contain"
      bg={`${slotItem.status === "Booked" ? "#F2F2F2" : "#FCE9E9"}`}
      color={`${slotItem.status === "Booked" ? "#4A4F4D" : "#2E3130"}`}
      height="54px"
      radius="3px"
      width="100%"
      sx={{
        fontWeight: selectSingleButton === slotItem ? "700" : "500",
        border: selectSingleButton === slotItem ? "4px solid #E02828" : "none",
      }}
      onClick={onClickFunc}
    >
      {`${slotStartTimeLocal} - ${slotEndTimeLocal}`}
    </Button>
  );
};

const TabelComponent = ({
  appointmentsData,
  isLoading,
  setRowData,
  rowData,
  setOpen,
  setViewMeetings,
  router,
}) => {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOpenUserMenu = (event) => {
    event.stopPropagation();
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleReschedule = () => {
    setOpen(true);
  };

  // useEffect(() => {
  //   setLoading(true);
  // }, [triggerLoading]);

  const handleViewMeetings = (data) => {
    setViewMeetings(true);
  };

  if (isLoading) {
    return (
      <div style={{minHeight:"300px",display:'flex',alignItems:"center",justifyContent:'center'}}>
        <LoaderTable />
      </div>
    );
  }
  const getTimeDifferenceInHours = (startTimeISO) => {
    const startTime = moment.utc(startTimeISO).local();
    const currentTime = moment();
    const timeDifference = startTime.diff(currentTime, "hours");
    return timeDifference;
  };

  return (
    <>
      <Table
        columns={columns(router, loading, setLoading)}
        data={appointmentsData?.data || []}
        enableRowSelection={false}
        renderRowActions={({ row, cell }) => (
          <IconButton
            disableRipple={true}
            size="large"
            aria-label="account of current user"
            aria-haspopup="true"
            onClick={(event) => {
              setRowData(cell?.row?.original);
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
        )}
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
        <MenuItem
          onClick={(cell) => {
            handleViewMeetings(data);
          }}
        >
          <MuiTypography textAlign="center" display="flex" alignItems="center">
            <VisibilityIcon sx={{ color: "#000000", marginRight: "5px" }} />
            View
          </MuiTypography>
        </MenuItem>

        {rowData?.statusId === APPOINTMENT_STATUSES.BOOKED &&
          getTimeDifferenceInHours(rowData?.startDateTime) > 24 && ( // Check if time difference is less than 24 hours // Check if the appointment is in the future
            // getTimeDifferenceInHours(rowData?.startDateTime) <= 0 &&
            <MenuItem
              onClick={({ cell, data }) => {
                handleReschedule(data, cell);
              }}
            >
              <MuiTypography
                textAlign="center"
                display="flex"
                alignItems="center"
              >
                <EditOutlinedIcon
                  sx={{ color: "#000000", marginRight: "5px" }}
                />
                Reschedule
              </MuiTypography>
            </MenuItem>
          )}

        {/* <MenuItem
          onClick={() => {
            setDeleteModal(true);
            setAnchorElUser(null);
          }}
        >
          <MuiTypography textAlign="center" display="flex" alignItems="center">
            <DeleteOutlineOutlinedIcon
              sx={{ color: "#000000", marginRight: "5px" }}
            />
            Delete
          </MuiTypography>
        </MenuItem> */}
      </StyledMenu>

      {deleteModal && (
        <DeleteModal
          open={deleteModal}
          handleClose={() => setDeleteModal(false)}
          tittle="Appointment"
          onConfirm={() => setDeleteModal(false)}
        />
      )}
    </>
  );
};
const columns = (router, loading, setLoading) => [
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
    header: "Appt StartTime",
    accessorKey: "aptTime",
    accessorFn: (row) => {
      const { time } = extractDateTimeComponents(row?.startDateTime);
      return <div>{moment.utc(row?.startDateTime).local().format("LT")}</div>;
    },
  },
  {
    header: "Appt EndTime",
    accessorKey: "aptEndTimeTime",
    accessorFn: (row) => {
      const { time } = extractDateTimeComponents(row?.startDateTime);
      return <div>{moment.utc(row?.endDateTime).local().format("LT")}</div>;
    },
  },
  {
    header: "Appt Fee",
    accessorKey: "amount",
    accessorFn: (row) => {
      return <div>$ {Number(row.amount)}</div>;
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
      // check if current date is equal to the start date
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
                setLoading(true);
                router.push(`/tele-communication/${row?.appointmentId}`);
              }}
              variant="contain"
              bg={"red"}
              color="#fff"
              width="45px"
              height="45px"
            >
              {loading ? <BeatLoader color="#fff" size="10px" /> : "Join"}
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

const data = [
  {
    id: 1,
    patients: "usama",
    doctor: "Dr. Emmy Massey",
    aptDate: "8/26/2023",
    aptTime: "09:30 PM",
    aptFee: "$100.00",
    status: (
      <div style={{ display: "flex", alignItems: "center" }}>
        <FiberManualRecordIcon
          sx={{ color: "#34C240", marginRight: "5px", fontSize: "12px" }}
        />
        <p>Completed</p>
      </div>
    ),
  },
  {
    id: 2,
    patients: "usama",
    doctor: "Dr. Emmy Massey",
    aptDate: "8/26/2023",
    aptTime: "09:30 PM",
    aptFee: "$100.00",
    status: (
      <div style={{ display: "flex", alignItems: "center" }}>
        <FiberManualRecordIcon
          sx={{ color: "#FA9638", marginRight: "5px", fontSize: "12px" }}
        />
        <p>Pending</p>
      </div>
    ),
  },
  {
    id: 3,
    patients: "usama",
    doctor: "Dr. Emmy Massey",
    aptDate: "8/26/2023",
    aptTime: "09:30 PM",
    aptFee: "$100.00",
    status: (
      <div style={{ display: "flex", alignItems: "center" }}>
        <FiberManualRecordIcon
          sx={{ color: "#D64242", marginRight: "5px", fontSize: "12px" }}
        />
        <p>Missed</p>
      </div>
    ),
  },
  {
    id: 4,
    patients: "usama",
    doctor: "Dr. Emmy Massey",
    aptDate: "8/26/2023",
    aptTime: "09:30 PM",
    aptFee: "$100.00",
    status: (
      <div style={{ display: "flex", alignItems: "center" }}>
        <FiberManualRecordIcon
          sx={{ color: "#348AF4", marginRight: "5px", fontSize: "12px" }}
        />
        <p>Upcoming</p>
      </div>
    ),
  },
];
