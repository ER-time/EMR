"use client";

import { useEffect, useState } from "react";
import {
  Avatar,
  IconButton,
  InputAdornment,
  Menu,
  Grid,
  MenuItem,
} from "@mui/material";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Search } from "@mui/icons-material";
import { TimePicker } from "@mui/x-date-pickers";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import Link from "next/link";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";

import { Box, Button } from "@/components";
import MuiTypography from "@/components/core/Typography";
import InputField from "@/components/core/Input";
import Table from "@/components/core/Table";
import Pagination from "@/components/core/Pagination";
import DatePicker from "@/components/core/DatePicker";
import { useGetAllUsersMutation } from "@/redux/slices/userProfile";
import dayjs from "dayjs";
import {
  convertDateToISOFormat,
  convertToUTCDate,
  extractDateTimeComponents,
} from "@/lib/utils";
import { Loader1 } from "@/components/core/Loader/Loader";
import moment from "moment";
import DateRangePickerComp from "@/components/webComponent/DateRangePicker";
import { USER_ROLE } from "@/config";

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
const StyledLink = styled(Link)`
  font-size: 14px;
  color: #999999;
  font-weight: 600;
  text-decoration: none;
  display: flex;
  align-items: center;
`;
const StyledPagination = styled.div`
  @media (max-width: 669px) {
    width: 100%;
    display: flex;
    justify-content: end;
  }
`;
export default function UserList() {
  const [filter, setFilter] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [startDate, setStartDate] = useState(null);

  const [
    getAllUsers,
    { data: allUsersData, isLoading, isError, isSuccess, error },
  ] = useGetAllUsersMutation();

  const [dateRange, setDateRange] = useState({
    endDateISO: null,
    startDateISO: null,
  });

  useEffect(() => {
    const payload = {
      pageNo: currentPage,
      pageSize: 5,
      search: searchValue,
      userRoleId: filter, 
      endDate: convertToUTCDate(dateRange?.endDateISO) || null,
      startDate: convertToUTCDate(dateRange?.startDateISO) || null,
    };
    getAllUsers(payload);
  }, [currentPage, getAllUsers, filter]);

  const onSearchHandler = (e) => {
    setSearchValue(e.target.value);
    if (e.target.value.length > 3 || e.target.value.length === 0) {
      const payload = {
        pageNo: currentPage,
        pageSize: 5,
        search: e.target.value,
        userRoleId: filter,
        endDate: convertToUTCDate(dateRange?.endDateISO) || null,
        startDate: convertToUTCDate(dateRange?.startDateISO) || null,
      };
      getAllUsers(payload);
    }
  };

  // const onDateSearchHandler = (date) => {
  //   if (date) {
  //     setStartDate(convertDateToISOFormat(date));
  //     const payload = {
  //       pageNo: currentPage,
  //       pageSize: 5,
  //       search: "",
  //       userRoleId: filter,
  //       startDate: convertDateToISOFormat(date),
  //     };
  //     getAllUsers(payload);
  //   }
  // };
  const handleDateChange = (start, end) => {
    console.log("start, end:", start, end);

    const startDateISO = start ? start.toISOString() : null;
    const endDateISO = end ? end.toISOString() : null;
    console.log("startDateISO::::",startDateISO);
    setDateRange({ endDateISO, startDateISO });
    const payload = {
      pageNo: currentPage,
      pageSize: 10,
      search: searchValue || "",
      userRoleId: filter,
      startDate: convertToUTCDate(startDateISO),
      endDate: convertToUTCDate(endDateISO),
    };

    console.log("payload:::", payload);

    getAllUsers(payload);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  return (
    <Grid item xs={12}>
      <Box p="25px" boxSizing="border-box">
        <Box
          display="flex"
          flexWrap="wrap"
          justifyContent="space-between"
          alignItems="center"
        >
          <MuiTypography variant="h6" component="h6" fontWeight="600">
            User Management
          </MuiTypography>
          <Box display="flex" width="auto" justifyContent="flex-end">
            <StyledLink href="/admin/user-management">
              View All <ArrowRightAltIcon />
            </StyledLink>
          </Box>
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
            
            }}
            sx={BUTTON_FILTER_XS.sx}
            {...BUTTON_FILTER}
            bg={`${filter === null ? "#348AF4" : "#F2F3F2"}`}
            color={`${filter === null ? "#fff" : "#636967"}`}
            >
              All
            </Button>

            <Button
            onClick={() => {
              setFilter(USER_ROLE.doctor);
            
            }}
            sx={BUTTON_FILTER_XS.sx}
            {...BUTTON_FILTER}
            bg={`${filter === USER_ROLE.doctor ? "#348AF4" : "#F2F3F2"}`}
            color={`${filter === USER_ROLE.doctor ? "#fff" : "#636967"}`}
            >
              Doctors
            </Button>

            <Button
              onClick={() => {
                setFilter(USER_ROLE.patient);
           
              }}
              sx={BUTTON_FILTER_XS.sx}
              {...BUTTON_FILTER}
              bg={`${filter === USER_ROLE.patient ? "#348AF4" : "#F2F3F2"}`}
              color={`${filter === USER_ROLE.patient ? "#fff" : "#636967"}`}
            >
              Patient
            </Button>
          </Box>

          <Box
            display="flex"
            flexWrap="wrap"
            justifyContent="flex-end"
            alignItems="center"
            width="auto"
            sx={{ display: { xs: "none", sm: "flex" } }}
          >
            {/* <StyledTimePicker /> */}
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
      <TabelComponent allUsersData={allUsersData} isLoading={isLoading} />
      <Box
        display="flex"
        flexWrap="wrap"
        alignItems="center"
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
          {currentPage === 1 ? 1 : (currentPage - 1) * 5 + 1} to{" "}
          {Math.min(currentPage * 5, allUsersData?.totalCounts) || 0}{" "}
          <span style={{ color: "#666666" }}>out of </span>
          {allUsersData?.totalCounts || 0}
        </MuiTypography>
        <StyledPagination>
          <Pagination
            count={Math.ceil(allUsersData?.totalCounts / 5) || 0}
            onPageChange={handlePageChange}
          />
        </StyledPagination>
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

const TabelComponent = ({ allUsersData, isLoading }) => {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const router = useRouter();

  const handleOpenUserMenu = (event) => {
    event.stopPropagation();
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  if (isLoading) {
    return (
      <>
        <Loader1 />
      </>
    );
  }
  return (
    <>
      <Table
        columns={columns}
        data={allUsersData?.data || []}
        enableRowActions={false}
        enableRowSelection={false}
        renderRowActions={({ row }) => (
          <IconButton
            disableRipple={true}
            size="large"
            aria-label="account of current user"
            aria-haspopup="true"
            onClick={handleOpenUserMenu}
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

const columns = [
  {
    header: "Name",
    accessorKey: "name",
    Cell: ({ cell }) => (
      <Box display="flex" alignItems="center">
        <Avatar sx={{ bgcolor: "rgb(224, 40, 40)", width: 40, height: 40 }}>
          OP
        </Avatar>
        <MuiTypography variant="body2" component="span" sx={{ mx: "10px" }}>
          {cell.row.original.firstName}
        </MuiTypography>
      </Box>
    ),
  },
  {
    header: "D.O.B",
    accessorKey: "dob",
    Cell: ({ cell }) => {
      const { date } = extractDateTimeComponents(cell.row.original.dob);
      return (
        <Box display="flex" alignItems="center">
          <MuiTypography variant="body2" component="span" sx={{ mx: "10px" }}>
            {moment(date).format("MM/DD/YY") || "N/A"}
          </MuiTypography>
        </Box>
      );
    },
  },

  {
    header: "Gender",
    accessorKey: "gender",
    Cell: ({ cell }) => (
      <Box display="flex" alignItems="center">
        <MuiTypography variant="body2" component="span" sx={{ mx: "10px" }}>
          {cell.row.original.gender || "N/A"}
        </MuiTypography>
      </Box>
    ),
  },
];
