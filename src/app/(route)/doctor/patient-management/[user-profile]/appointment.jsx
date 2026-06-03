import {
  Grid,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
} from "@mui/material";
import Table from "@/components/core/Table";
import Pagination from "@/components/core/Pagination";
import { usePathname, useRouter } from "next/navigation";
import { TimePicker } from "@mui/x-date-pickers";
import styled from "styled-components";
import DatePicker from "@/components/core/DatePicker";
import InputField from "@/components/core/Input";
import { Search } from "@mui/icons-material";
import { useEffect, useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Box, Button, DotStatusBadge } from "@/components";
import MuiTypography from "@/components/core/Typography";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useGetAllAppointmentsMutation } from "@/redux/slices/appointments";
import { APPOINTMENT_STATUSES } from "@/config";
import {
  convertDateToISOFormat,
  convertToUTCDate,
  extractDateTimeComponents,
} from "@/lib/utils";
import moment from "moment";
import ChatHistoryDrawer from "../chatHistoryDrawer";
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

export default function Appointments() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [filter, setFilter] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState("");
  const [rowId, setRowId] = useState("");
  const pathname = usePathname();
  const url = pathname.split("/");
  const lastItem = url[url.length - 1];

  const [state, setState] = useState({ right: false });
  console.log("state::::=====>", state);

  const [dateRange, setDateRange] = useState({
    endDateISO: null,
    startDateISO: null,
  });

  const [
    getAllAppointments,
    { isLoading, isError, isSuccess, data: appointmentData, error },
  ] = useGetAllAppointmentsMutation();
  useEffect(() => {
    const fetchData = async () => {
      await getAllAppointments({
        userId: lastItem,
        pageNo: currentPage,
        pageSize: 10,
        statusId: filter,
        search: searchValue || null,
        startDate: dateRange?.startDateISO || null,
        endDate: convertToUTCDate(dateRange?.endDateISO) || null,
        startDate: convertToUTCDate(dateRange?.startDateISO) || null,
      });
    };
    fetchData();
  }, [currentPage, lastItem, filter]);

  const onSearchHandler = (e) => {
    setSearchValue(e.target.value);
    if (e.target.value.length > 3 || e.target.value.length === 0) {
      const payload = {
        pageNo: currentPage,
        pageSize: 10,
        search: e.target.value,
        statusId: filter,
        userId: lastItem,
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
  //       pageNo: currentPage,
  //       pageSize: 10,
  //       startDate: convertDateToISOFormat(date),
  //       statusId: filter,
  //       userId: lastItem,
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
      userId: lastItem,
      startDate: convertToUTCDate(startDateISO),
      endDate: convertToUTCDate(endDateISO),
    };

    console.log("payload:::", payload);

    getAllAppointments(payload);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

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
  return (
    <Grid>
      <Grid item xs={12}>
        <Box p="15px 25px" boxSizing="border-box">
          {/* <MuiTypography variant="h6" component="h6" fontWeight="600">
            Appointments
          </MuiTypography> */}
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
                onClick={() => setFilter("upcoming")}
                sx={BUTTON_FILTER_XS.sx}
                {...BUTTON_FILTER}
                bg={`${filter === "upcoming" ? "#348AF4" : "#F2F3F2"}`}
                color={`${filter === "upcoming" ? "#fff" : "#636967"}`}
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
                  filter === APPOINTMENT_STATUSES.MISSED ? "#348AF4" : "#F2F3F2"
                }`}
                color={`${
                  filter === APPOINTMENT_STATUSES.MISSED ? "#fff" : "#636967"
                }`}
              >
                Missed
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
                  filter === APPOINTMENT_STATUSES.BOOKED ? "#348AF4" : "#F2F3F2"
                }`}
                color={`${
                  filter === APPOINTMENT_STATUSES.BOOKED ? "#fff" : "#636967"
                }`}
              >
                Booked
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
                  filter === APPOINTMENT_STATUSES.COMPLETED ? "#fff" : "#636967"
                }`}
              >
                completed
              </Button>

              {/* <Button
                onClick={() => setFilter("reschedule")}
                sx={BUTTON_FILTER_XS.sx}
                {...BUTTON_FILTER}
                bg={`${filter === "reschedule" ? "#348AF4" : "#F2F3F2"}`}
                color={`${filter === "reschedule" ? "#fff" : "#636967"}`}
              >
                Reschedule
              </Button> */}
            </Box>

            <Box
              display="flex"
              flexWrap="wrap"
              justifyContent="flex-end"
              alignItems="center"
              boxSizing="border-box"
              width="auto"
              sx={{ display: { xs: "none", sm: "flex" }, marginLeft: "auto" }}
            >
              {/* <StyledTimePicker /> */}
              {/* <DatePicker
                height="40px"
                width="160px"
                border="1px solid #e5e6e6"
                radius="6px"
                fsize="14px"
                value={startDate}
                onChange={onDateSearchHandler}
              /> */}
              <DateRangePickerComp onDateChange={handleDateChange} />
              <InputField
                id="email"
                placeholder="Search"
                value={searchValue}
                onChange={onSearchHandler}
                {...INPUT_FIELD_PROPS_SEARCH}
                sx={INPUT_FIELD_STYLES_SEARCH.sx}
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
          appointmentData={appointmentData}
          setSelectedRowId={setSelectedRowId}
          setRowId={setRowId}
          rowId={rowId}
          isLoading={isLoading}
          state={state}
          setState={setState}
        />

        <Box
          display="flex"
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

          <Pagination
            count={Math.ceil(appointmentData?.totalCounts / 10)}
            onPageChange={handlePageChange}
          />
        </Box>
      </Grid>
    </Grid>
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

const TabelComponent = ({
  appointmentData,
  setSelectedRowId,
  setRowId,
  rowId,
  setState,
  state,
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

  const handleDrawerToggle = () => {
    toggleDrawer("right", !state.right);
  };

  const handleOpenUserMenu = (event) => {
    event.stopPropagation();
    setSelectedRowId(rowId);
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const handleButtonClick = (row) => {
    setRowId(row);
    toggleDrawer("right", true)(); // Immediately invoke the function with true to open
  };
  const columns = [
    {
      header: "Doctors",
      accessorKey: "doctor",
      Cell: ({ cell }) => (
        <Box display="flex" alignItems="center">
          <MuiTypography variant="body2" component="span" sx={{ mx: "10px" }}>
            {cell.row.original.patient}
          </MuiTypography>
        </Box>
      ),
      width: "80px",
    },
    {
      header: "Appointment Date",
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
        // const { time } = extractDateTimeComponents(row?.startDateTime);
        return <div>{moment.utc(row?.startDateTime).local().format("LT")}</div>;
      },
    },
    {
      header: "Appointment Fee",
      accessorKey: "amount",
      accessorFn: (row) => {
        return <div>$ {row.amount}</div>;
      },
    },
    {
      header: "Appointment Status",
      accessorKey: "status",
      accessorFn: (row) => {
        let color;
        switch (row.status) {
          case "Canceled":
            color = "#E02828"; // Red color for canceled
            break;
          case "Pending":
            color = "#FFA500"; // Orange color for pending
            break;
          case "Upcoming":
            color = "#007bff"; // Blue color for upcoming
            break;
          case "Missing":
            color = "#6c757d"; // Gray color for missing
            break;
          default:
            color = "#000000"; // Black color for other statuses
        }

        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            <FiberManualRecordIcon
              sx={{ color: color, marginRight: "5px", fontSize: "12px" }}
            />
            <p>{row.status}</p>
          </div>
        );
      },
    },
    {
      header: "Chat History",
      accessorKey: "chatHistory",
      accessorFn: (row) => {
        return (
          <StyledButton
            sx={{
              py: 1,
              px: 3,
              mr: 2,
              width: "150px",
              color: "white",
              display: "flex",
              justifyContent: "center",
            }}
            disabled={!row?.chatSessionId}
            cursor="pointer"
            onClick={() => handleButtonClick(row)}
          >
            {"Chat History"}
          </StyledButton>
        );
      },
      width: "80px",
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        data={appointmentData?.data || []}
        enableRowSelection={false}
        enableRowActions={false}
        // renderRowActions={({ cell }) => (
        // <>
        //   <IconButton
        //     disableRipple
        //     size="large"
        //     aria-haspopup="true"
        //     onClick={(event) => {
        // setRowId(cell?.row?.original);
        // handleOpenUserMenu(event);
        //     }}
        //     color="inherit"
        //   >
        //     <MoreVertIcon />
        //   </IconButton>
        //   <StyledMenu
        //     id="menu-appbar"
        //     anchorEl={anchorElUser}
        //     open={Boolean(anchorElUser)}
        //     onClose={handleCloseUserMenu}
        //   >
        // <MenuItem onClick={toggleDrawer("right", true)}>
        //   <VisibilityIcon sx={{ fontSize: "20px" }} />
        //   <MuiTypography
        //     variant="subtitle1"
        //     fontWeight="400"
        //     component="span"
        //     ml={0.5}
        //   >
        //     Chat History
        //   </MuiTypography>
        // </MenuItem>
        //     </StyledMenu>
        //   </>
        // )}
      />
      <ChatHistoryDrawer
        state={drawerState}
        toggleDrawer={toggleDrawer}
        rowId={rowId}
        setRowId={setRowId}
      />
    </>
  );
};
