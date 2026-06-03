import { Grid, InputAdornment, Menu, MenuItem } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { TimePicker } from "@mui/x-date-pickers";
import styled from "styled-components";
import DatePicker from "@/components/core/DatePicker";
import InputField from "@/components/core/Input";
import { Search } from "@mui/icons-material";
import { useEffect, useState } from "react";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import Link from "next/link";

import Table from "@/components/core/Table";
import Pagination from "@/components/core/Pagination";
import { Box, Button } from "@/components";
import MuiTypography from "@/components/core/Typography";
import { useGetAllAppointmentsMutation } from "@/redux/slices/appointments";
import { LoaderTable } from "@/components/core/Loader/Loader";
import { convertDateToISOFormat, convertToUTCDate, extractDateTimeComponents } from "@/lib/utils";
import { APPOINTMENT_STATUSES } from "@/config";
import moment from "moment";
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
const StyledLink = styled(Link)`
  font-size: 14px;
  color: #999999;
  font-weight: 600;
  text-decoration: none;
  display: flex;
  align-items: center;
`;
export default function Appointments() {
  const [filter, setFilter] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [startDate, setStartDate] = useState(null);
  const pathname = usePathname();
  const url = pathname.split("/");
  const lastItem = url[url.length - 1];
  const searchParams = useSearchParams();
  const role = searchParams.get("userRole");
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const [
    getAllAppointments,
    { isLoading, isError, isSuccess, data: appointmentData, error },
  ] = useGetAllAppointmentsMutation();

  const [dateRange, setDateRange] = useState({
    endDateISO: null,
    startDateISO: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      await getAllAppointments({
        userId: lastItem,
        pageNo: currentPage,
        pageSize: 10,
        statusId: filter,
        search: searchValue || null,
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
      userId: lastItem,
      startDate: startDateISO,
      startDate: convertToUTCDate(startDateISO),
      endDate: convertToUTCDate(endDateISO),
    };

    console.log("payload:::", payload);

    getAllAppointments(payload);
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
    <Grid item xs={12}>
      <Box p="25px" boxSizing="border-box">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <MuiTypography variant="h6" component="h6" fontWeight="600">
            Appointments
          </MuiTypography>
          {/* <Box display="flex" justifyContent="flex-end">
            <StyledLink href="/admin/appointments">
              View All <ArrowRightAltIcon />
            </StyledLink>
          </Box> */}
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
                filter === APPOINTMENT_STATUSES.UPCOMING ? "#348AF4" : "#F2F3F2"
              }`}
              color={`${
                filter === APPOINTMENT_STATUSES.UPCOMING ? "#fff" : "#636967"
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
            <DateRangePickerComp onDateChange={handleDateChange} />
            {/* <DatePicker
              height="40px"
              width="160px"
              border="1px solid #e5e6e6"
              radius="6px"
              fsize="14px"
              value={startDate}
              onChange={onDateSearchHandler}
            /> */}
            <InputField
              id="search"
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
        appointmentsData={appointmentData}
        isLoading={isLoading}
        role={role}
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

const TabelComponent = ({ isLoading, appointmentsData, role }) => {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const router = useRouter();

  if (isLoading) {
    return (
      <div>
        <LoaderTable />
      </div>
    );
  }

  if (!appointmentsData) {
    return (
      <div>
        <LoaderTable />
      </div>
    );
  }
  const handleOpenUserMenu = (event) => {
    event.stopPropagation();
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const columns = [
    {
      header: role === "Doctor" ? "Patient" : "Doctors",
      accessorKey: role === "Doctor" ? "patient" : "doctor",
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
        const { time } = extractDateTimeComponents(row?.startDateTime);
        return <div>{time}</div>;
      },
    },
    {
      header: "Appt Fee",
      accessorKey: "amount",
      accessorFn: (row) => {
        return <div>${row.amount}</div>;
      },
    },
    {
      header: "Status",
      accessorKey: "status",
      accessorFn: (row) => {
        let color;
        switch (row.status) {
          case "Completed":
            color = "#E02828"; // Red color for canceled
            break;
          case "Missed":
            color = "#FFA500"; // Orange color for pending
            break;
          case "Upcoming":
            color = "#007bff"; // Blue color for upcoming
            break;
          case "Booked":
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
  ];
  return (
    <>
      <Table
        columns={columns}
        data={appointmentsData?.data || []}
        defaultColumn={{
          maxSize: 0,
          minSize: 0,
          size: 0,
        }}
        enableRowSelection={false}
        enableRowActions={false}
        // renderRowActions={({ row }) => (
        //   <IconButton
        //     disableRipple={true}
        //     size="large"
        //     // edge="end"
        //     aria-label="account of current user"
        //     aria-haspopup="true"
        //     onClick={handleOpenUserMenu}
        //     role="button"
        //     tabIndex="0"
        //     onKeyDown={(e) => {
        //       e.stopPropagation();
        //     }}
        //     color="inherit"
        //   >
        //     <MoreVertIcon />
        //   </IconButton>
        // )}
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
        <MenuItem onClick={() => router.push("/user-managment/2")}>
          <VisibilityIcon sx={{ fontSize: "20px" }} />
          <MuiTypography
            variant="subtitle1"
            fontWeight="400"
            component="span"
            ml={0.5}
          >
            View
          </MuiTypography>
        </MenuItem>
        <MenuItem>
          <ModeEditIcon sx={{ fontSize: "20px" }} />
          <MuiTypography
            variant="subtitle1"
            fontWeight="400"
            component="span"
            ml={0.5}
          >
            Edit
          </MuiTypography>
        </MenuItem>
        <MenuItem>
          <DeleteIcon sx={{ fontSize: "20px" }} />
          <MuiTypography
            variant="subtitle1"
            fontWeight="400"
            component="span"
            ml={0.5}
          >
            Delete
          </MuiTypography>
        </MenuItem>
      </StyledMenu>
    </>
  );
};
