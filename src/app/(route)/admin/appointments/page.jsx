"use client";

import { useEffect, useState } from "react";
import {
  Drawer,
  Grid,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
} from "@mui/material";
import styled from "styled-components";
import { Search } from "@mui/icons-material";
import { TimePicker } from "@mui/x-date-pickers";
import { Box, Button } from "@/components";
import MuiTypography from "@/components/core/Typography";
import InputField from "@/components/core/Input";
import Table from "@/components/core/Table";
import Pagination from "@/components/core/Pagination";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DatePicker from "@/components/core/DatePicker";
import { useRouter } from "next/navigation";
import AppointmentDetails from "./appointmentDetails";
import useScreenWidth from "@/hooks/useScreenWidth";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { DeleteModal } from "@/components/webComponent";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { useGetAllAppointmentsMutation } from "@/redux/slices/appointments";
import { LoaderTable } from "@/components/core/Loader/Loader";
import {
  convertDateToISOFormat,
  convertToUTCDate,
  extractDateTimeComponents,
} from "@/lib/utils";
import { APPOINTMENT_STATUSES } from "@/config";
import moment from "moment";
import DateRangePickerComp from "@/components/webComponent/DateRangePicker";

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

export default function UserManagment() {
  const screenWidth = useScreenWidth();
  const [filter, setFilter] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowData, setRowData] = useState("");
  console.log("searchValue:::", searchValue);
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
        pageNo: currentPage,
        pageSize: 10,
        statusId: filter,
        search: searchValue || null,
        endDate: convertToUTCDate(dateRange?.endDateISO) || null,
        startDate: convertToUTCDate(dateRange?.startDateISO) || null,
      });
    };
    fetchData();
  }, [currentPage, filter, startDate]);

  const onSearchHandler = (e) => {
    setSearchValue(e.target.value);
    if (e.target.value.length > 3 || e.target.value.length === 0) {
      const payload = {
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

  const handleDateChange = (start, end) => {
    console.log("start, end:", start, end);

    const startDateISO = start ? start.toISOString() : null;
    const endDateISO = end ? end.toISOString() : null;
    setDateRange({ endDateISO, startDateISO });
    const payload = {
      pageNo: currentPage,
      pageSize: 10,
      // userId: userID,
      startDate: convertToUTCDate(startDateISO),
      endDate: convertToUTCDate(endDateISO),
    };

    console.log("payload:::", payload);

    getAllAppointments(payload);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

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
                    bg={`${filter ===  APPOINTMENT_STATUSES.UPCOMING ? "#348AF4" : "#F2F3F2"}`}
                    color={`${filter ===  APPOINTMENT_STATUSES.UPCOMING ? "#fff" : "#636967"}`}
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
                      setFilter(APPOINTMENT_STATUSES.BOOKEDING);
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
                    value={startDate}
                    onChange={onDateSearchHandler}
                  /> */}
                  <DateRangePickerComp onDateChange={handleDateChange} />
                  <InputField
                    value={searchValue} // Set value of InputField to the state
                    onChange={onSearchHandler}
                    id="email"
                    placeholder="Search"
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
              detailsOpen={detailsOpen}
              setDetailsOpen={setDetailsOpen}
              appointmentsData={appointmentData}
              isLoading={isLoading}
              setRowData={setRowData}
            />
            <Box
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
              >
                {currentPage} to{" "}
                {(appointmentData && appointmentData?.data?.length) || 0}{" "}
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
        {detailsOpen === true && screenWidth >= 1400 && (
          <Grid item xs={12} lg={4}>
            <AppointmentDetails
              detailsOpen={detailsOpen}
              setDetailsOpen={setDetailsOpen}
              rowData={rowData}
            />
          </Grid>
        )}

        {screenWidth < 1400 && (
          <Drawer
            anchor="right"
            open={detailsOpen}
            onClose={() => setDetailsOpen(false)}
          >
            <AppointmentDetails
              rowData={rowData}
              detailsOpen={detailsOpen}
              setDetailsOpen={setDetailsOpen}
            />
          </Drawer>
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

const TabelComponent = ({ appointmentsData, setDetailsOpen, setRowData }) => {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const router = useRouter();

  const [deleteModal, setDeleteModal] = useState(false);

  const handleOpenUserMenu = (event) => {
    event.stopPropagation();
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  if (!appointmentsData) {
    return (
      <div>
        <LoaderTable />
      </div>
    );
  }

  return (
    <>
      <Table
        columns={columns}
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
        muiTableBodyRowProps={({ row, cell }) => ({
          onClick: () => {
            setRowData(row?.original);
            // setDetailsOpen(true);
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
        <MenuItem
          onClick={() => {
            setDetailsOpen(true);
            setAnchorElUser(null);
          }}
        >
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
        {/* <MenuItem>
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
        <MenuItem
          onClick={() => {
            setDeleteModal(true);
            setAnchorElUser(null);
          }}
        >
          <DeleteIcon sx={{ fontSize: "20px" }} />
          <MuiTypography
            variant="subtitle1"
            fontWeight="400"
            component="span"
            ml={0.5}
          >
            Delete
          </MuiTypography>
        </MenuItem> */}
      </StyledMenu>

      {deleteModal && (
        <DeleteModal
          open={deleteModal}
          handleClose={() => setDeleteModal(false)}
          tittle="Delete Appointment"
          onConfirm={() => console.log("")}
        />
      )}
    </>
  );
};

const columns = [
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
    header: "Appt Time",
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
      return <div>$ {Number(row?.amount)}</div>;
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
