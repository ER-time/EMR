"use client";

import { useState } from "react";
import {
  Avatar,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
} from "@mui/material";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Search } from "@mui/icons-material";
import { TimePicker } from "@mui/x-date-pickers";

import { Box, Button } from "@/components";
import MuiTypography from "@/components/core/Typography";
import InputField from "@/components/core/Input";
import Table from "@/components/core/Table";
import Pagination from "@/components/core/Pagination";
import DatePicker from "@/components/core/DatePicker";

import VisibilityIcon from "@mui/icons-material/Visibility";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";

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

export default function UserList() {
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  return (
    <Box width="100%">
      <Box p="20px">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          boxSizing="border-box"
        >
          <MuiTypography variant="h6" component="h6" fontWeight="600">
            User Management
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
              onClick={() => setFilter("all")}
              sx={BUTTON_FILTER_XS.sx}
              {...BUTTON_FILTER}
              bg={`${filter === "all" ? "#348AF4" : "#F2F3F2"}`}
              color={`${filter === "all" ? "#fff" : "#636967"}`}
            >
              All
            </Button>

            <Button
              onClick={() => setFilter("doctor")}
              sx={BUTTON_FILTER_XS.sx}
              {...BUTTON_FILTER}
              bg={`${filter === "doctor" ? "#348AF4" : "#F2F3F2"}`}
              color={`${filter === "doctor" ? "#fff" : "#636967"}`}
            >
              Doctors
            </Button>

            <Button
              onClick={() => setFilter("patient")}
              sx={BUTTON_FILTER_XS.sx}
              {...BUTTON_FILTER}
              bg={`${filter === "patient" ? "#348AF4" : "#F2F3F2"}`}
              color={`${filter === "patient" ? "#fff" : "#636967"}`}
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
            <StyledTimePicker />
            <DatePicker
              height="40px"
              width="160px"
              border="1px solid #e5e6e6"
              radius="6px"
              fsize="14px"
            />
            <InputField
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
      <TabelComponent />
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
          {currentPage} to 20 <span style={{ color: "#666666" }}>out of </span>
          430 entries
        </MuiTypography>

        <Pagination count={20} onPageChange={handlePageChange} />
      </Box>
    </Box>
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

const TabelComponent = () => {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const router = useRouter();

  const handleOpenUserMenu = (event) => {
    event.stopPropagation();
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <>
      <Table
        columns={columns}
        data={data}
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
        <MenuItem>
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
          {cell.row.original.patient}
        </MuiTypography>
      </Box>
    ),
  },
  {
    header: "Last Appt",
    accessorKey: "lastAppt",
  },
  {
    header: "DOB",
    accessorKey: "dob",
  },
  {
    header: "Gender",
    accessorKey: "gender",
  },
];

const data = [...Array(5)].map(() => ({
  name: "Petter",
  lastAppt: "01/01/2000",
  dob: "01/01/2000",
  gender: "male",
}));
