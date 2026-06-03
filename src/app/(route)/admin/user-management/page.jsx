"use client";

import { useEffect, useState } from "react";
import {
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Search } from "@mui/icons-material";
import styled from "styled-components";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { useRouter } from "next/navigation";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Box, Button, GenericModal } from "@/components";
import MuiTypography from "@/components/core/Typography";
import InputField from "@/components/core/Input";
import Table from "@/components/core/Table";
import Pagination from "@/components/core/Pagination";
import DatePicker from "@/components/core/DatePicker";
import AddUserForm from "./add-user/addUserForm";
import { USER_ROLE } from "@/config";
import { LoaderTable } from "@/components/core/Loader/Loader";
import DeleteUserManagementModal from "@/components/ui/deleteUserManagementModal";
import dayjs from "dayjs";
import { convertToUTCDate, extractDateTimeComponents } from "@/lib/utils";
import { useGetAllUsersMutation } from "@/redux/slices/userProfile";
import moment from "moment";
import { useUpdateUserStatusMutation } from "@/redux/slices/user";
import { onFailure, onSuccess } from "@/redux/features/apiStatusSlice";
import { useDispatch } from "react-redux";
import DateRangePickerComp from "@/components/webComponent/DateRangePicker";
import { FormControl } from "react-bootstrap";

// const StyledTimePicker = styled(TimePicker)`
//   height: 40px;
//   && {
//     margin: 0px 10px;
//   }
//   .MuiInputBase-root {
//     width: 140px;
//     height: 100%;
//   }
//   .MuiOutlinedInput-notchedOutline {
//     border: 1px solid #e5e6e6 !important;
//     border-radius: 6px;
//   }
//   input {
//     font-size: 14px;
//   }
//   label {
//     font-size: 14px;
//     color: #969c9a;
//     line-height: normal;
//     /* -webkit-transform: translate(14px, 12px) scale(1); */
//   }
// `;

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

export default function UserList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const [rowId, setRowId] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState("");
  const [userType, setUserType] = useState(USER_ROLE.patient);
  const [refetchData, setRefetchData] = useState(false);
  // const [checked, setChecked] = useState("Active");
  const [status, setStatus] = useState("Active");
  const [showStatusTogglerModal, setShowStatusTogglerModal] = useState(false);
  console.log("showStatusTogglerModal::::", showStatusTogglerModal);

  const [dateRange, setDateRange] = useState({
    endDateISO: null,
    startDateISO: null,
  });

  const [
    getAllUsers,
    { data: allUsersData, isLoading, isError, isSuccess, error },
  ] = useGetAllUsersMutation();
  // const handleChange = async (event) => {
  //   setChecked(event.target.checked);
  //   const payload = {
  //     pageNo: currentPage,
  //     pageSize: 10,
  //     search: searchValue,
  //     userRoleId: filter,
  //     endDate: convertToUTCDate(dateRange?.endDateISO) || null,
  //     startDate: convertToUTCDate(dateRange?.startDateISO) || null,
  //     isActive: !checked,
  //   };
  //   await getAllUsers(payload);
  // };
  const [
    updateUserStatus,
    { data: updateUserStatusData, isLoading: updateUserStatusIsLoading },
  ] = useUpdateUserStatusMutation();
  console.log("dateRange:::", dateRange.endDateISO);

  // const handleChange = (event) => {
  //   setStatus(event.target.value);
  // };

  const handleChange = async (event) => {
    const newStatusValue = event.target.value;
    setStatus(newStatusValue);
    const payload = {
      pageNo: currentPage,
      pageSize: 10,
      search: searchValue,
      userRoleId: filter,
      endDate: convertToUTCDate(dateRange?.endDateISO) || null,
      startDate: convertToUTCDate(dateRange?.startDateISO) || null,
      isActive: newStatusValue === "Active", // Determine isActive based on status
    };

    await getAllUsers(payload);
  };

  useEffect(() => {
    const payload = {
      pageNo: currentPage,
      pageSize: 10,
      search: searchValue,
      userRoleId: filter,
      endDate: convertToUTCDate(dateRange?.endDateISO) || null,
      startDate: convertToUTCDate(dateRange?.startDateISO) || null,
      isActive: status === "Active",
    };
    getAllUsers(payload);
  }, [currentPage, getAllUsers, filter, refetchData, startDate]);

  const updateStatusHandler = async () => {
    try {
      const resp = await updateUserStatus(rowId.userId);
      if (resp?.data?.succeeded === true) {
        console.log("resp?.data:::", resp?.data);
        dispatch(
          onSuccess({
            message:
              resp?.data?.data === "User Activate Successfully!"
                ? "User Active Successfully"
                : resp?.data?.data ===
                  "Can not InActive this user as this user has booked an appointment in Future"
                ? "Can not InActive this user as this user has booked an appointment in Future"
                : "User InActive Successfully",
          })
        );
        setShowStatusTogglerModal(false);
        setRefetchData((pre) => !pre);
      } else {
        dispatch(
          onFailure({
            message: resp?.data?.message || "Invalid Email address",
          })
        );
        setShowStatusTogglerModal(false);
      }
    } catch (error) {
      dispatch(
        onFailure({
          message: error?.data?.message || "Failure",
        })
      );
      setShowStatusTogglerModal(false);
    }
  };

  const onSearchHandler = (e) => {
    setSearchValue(e.target.value);
    if (e.target.value.length > 3 || e.target.value.length === 0) {
      const payload = {
        pageNo: currentPage,
        pageSize: 10,
        search: e.target.value,
        userRoleId: filter,
        endDate: convertToUTCDate(dateRange?.endDateISO) || null,
        startDate: convertToUTCDate(dateRange?.startDateISO) || null,
        isActive: status === "Active",
      };
      getAllUsers(payload);
    }
  };

  // const onDateSearchHandler = (date) => {
  //   if (date) {
  //     setStartDate(date);
  //     const payload = {
  //       pageNo: currentPage,
  //       pageSize: 10,
  //       search: "",
  //       userRoleId: filter,
  //       startDate: moment(new Date(date)).format("YYYY-MM-DD"),
  //     };
  //     getAllUsers(payload);
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
      search: searchValue || "",
      userRoleId: filter,
      startDate: convertToUTCDate(startDateISO),
      endDate: convertToUTCDate(endDateISO),
    };

    console.log("payload:::", payload);

    getAllUsers(payload);
  };

  const handleOpen = () => setOpen(true);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRowId("");
  };
  const handleCloseStatusModal = () => {
    setShowStatusTogglerModal(false);
    setSelectedRowId("");
  };

  const exportToExcel = () => {
    if (!Array.isArray(allUsersData.data)) {
      console.error("allUsersData is not an array");
      return;
    }

    const fieldsToKeep = {
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email",
      doctorFee: "Doctor Fee",
      phoneNo: "Phone Number",
      language: "Language",
      role: "Role",
      address: "Address",
      doctorFee: "Doctor Fee",
    };

    const updatedUsers =
      allUsersData?.data?.length > 0 &&
      allUsersData?.data.map((user) => {
        const filteredUser = {};
        for (const [originalKey, newKey] of Object.entries(fieldsToKeep)) {
          filteredUser[newKey] =
            user[originalKey] === null ? "N/A" : user[originalKey];
        }
        return filteredUser;
      });

    const worksheet = XLSX.utils.json_to_sheet(updatedUsers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(blob, "data.xlsx");
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
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              flexWrap="wrap"
              p="0px 20px"
              boxSizing="border-box"
            >
              <MuiTypography variant="h6" component="h6" fontWeight="600">
                User Management
              </MuiTypography>
              <Button
                variant="contain"
                bg="#E02828"
                color="#fff"
                height="45px"
                startIcon={<AddIcon />}
                radius="12px"
                sx={{ margin: "15px 0px" }}
                onClick={handleOpen}
              >
                Add User
              </Button>
            </Box>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              flexWrap="wrap"
              px="20px"
            >
              <Box width="auto">
                <Button
                  onClick={() => {
                    setFilter(null);
                    setCurrentPage(1);
                    // setSearchValue("");
                    setStartDate(null);
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
                    setCurrentPage(1);
                    // setSearchValue("");
                    setStartDate(null);
                  }}
                  sx={BUTTON_FILTER_XS.sx}
                  {...BUTTON_FILTER}
                  bg={`${filter === USER_ROLE.doctor ? "#348AF4" : "#F2F3F2"}`}
                  color={`${filter === USER_ROLE.doctor ? "#fff" : "#636967"}`}
                >
                  Doctor
                </Button>

                <Button
                  onClick={() => {
                    setFilter(USER_ROLE.patient);
                    setCurrentPage(1);
                    // setSearchValue("");
                    setStartDate(null);
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
                boxSizing="border-box"
                sx={{
                  display: { xs: "none", sm: "flex" },
                  marginLeft: "auto",
                }}
              >
                <>
                  {/* <Select
                    id="status"
                    name="status"
                    value={status}
                    onChange={handleChange}
                    fullWidth={true}
                  >
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Inactive">Inactive</MenuItem>
                  </Select> */}
                  <Select
                    id="status"
                    name="status"
                    value={status}
                    onChange={handleChange}
                    size="small"
                    sx={{ minWidth: "120px", mr: 2 }} // Ensures the select has a consistent size
                  >
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Inactive">Inactive</MenuItem>
                  </Select>
                </>
                <Button
                  sx={{ mr: 2 }}
                  variant="contain"
                  bg="#348AF4"
                  color="#fff"
                  height="40px"
                  radius="6px"
                  onClick={exportToExcel}
                >
                  Export to Excel
                </Button>
                {/* <StyledTimePicker label="HH:MM:AA" /> */}
                {/* <DatePicker
                  height="40px"
                  width="160px"
                  border="1px solid #e5e6e6"
                  radius="6px"
                  fsize="14px"
                  value={dayjs(startDate)}
                  onChange={onDateSearchHandler}
                  inputValue=""
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
            <TabelComponent
              setUserType={setUserType}
              setSelectedRowId={setSelectedRowId}
              open={open}
              setOpen={setOpen}
              allUsersData={allUsersData}
              isLoading={isLoading}
              setShowDeleteModal={setShowDeleteModal}
              updateStatusHandler={updateStatusHandler}
              setRowId={setRowId}
              rowId={rowId}
              setShowStatusTogglerModal={setShowStatusTogglerModal}
              showStatusTogglerModal={showStatusTogglerModal}
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
                {currentPage === 1 ? 1 : (currentPage - 1) * 10 + 1} to{" "}
                {Math.min(currentPage * 10, allUsersData?.totalCounts) || 0}{" "}
                <span style={{ color: "#666666" }}>out of </span>
                {allUsersData?.totalCounts || 0}
              </MuiTypography>

              <Pagination
                count={Math.ceil(allUsersData?.totalCounts / 10) || 0}
                onPageChange={handlePageChange}
              />
            </Box>
          </Box>
        </Grid>
      </Grid>
      {open && (
        <GenericModal
          show={open}
          onHide={handleClose}
          tittle={
            selectedRowId
              ? `${
                  selectedRowId?.roleId === USER_ROLE.doctor
                    ? "Update Doctor"
                    : "Update Patient"
                }`
              : `${
                  userType === USER_ROLE.doctor ? "Add Doctor" : "Add Patient"
                }`
          }
        >
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={6}>
              <CustomRadioButton
                isDisabled={selectedRowId?.roleId ? true : false}
                tittle="Patient"
                name={USER_ROLE.patient}
                type={userType}
                active={true}
                onClick={() => setUserType(USER_ROLE.patient)}
              />
            </Grid>

            <Grid item xs={12} md={6} lg={6}>
              <Box width="100%">
                <CustomRadioButton
                  isDisabled={selectedRowId?.roleId ? true : false}
                  tittle="Doctor"
                  name={USER_ROLE.doctor}
                  type={userType}
                  onClick={() => setUserType(USER_ROLE.doctor)}
                />
              </Box>
            </Grid>
          </Grid>
          <Box>
            <Divider sx={{ my: 2 }} />
          </Box>
          <AddUserForm
            allUsersData={selectedRowId}
            userData={selectedRowId}
            type={userType}
            onCancel={handleClose}
            setRefetchData={setRefetchData}
          />
        </GenericModal>
      )}
      {showStatusTogglerModal && (
        <GenericModal
          show={showStatusTogglerModal}
          onHide={handleCloseStatusModal}
          tittle={`Are you sure you want to ${
            selectedRowId?.isActive ? "Active" : "InActive"
          } this user ?`}
          size="sm"
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: "0px !important",
          }}
        >
          {/* <Typography>Are you sure you want to Active User</Typography> */}
          <Box
            sx={{ display: "flex", justifyContent: "center", width: "100%" }}
          >
            <StyledButton
              sx={{ py: 1, px: 3, mr: 2, justifyContent: "end" }}
              onClick={() => updateStatusHandler()}
            >
              Yes
            </StyledButton>
            <Button
              sx={{
                margin: "0px 10px",
                color: "#e02828",
                border: "1px solid #e02828",
                fontWeight: "bold",
                "&:hover": {
                  border: "1px solid #e02828",
                },
              }}
              variant="outlined"
              onClick={handleCloseStatusModal}
            >
              No
            </Button>
          </Box>
        </GenericModal>
      )}
      <DeleteUserManagementModal
        userData={selectedRowId}
        setShowDeleteModal={setShowDeleteModal}
        showDeleteModal={showDeleteModal}
        setRefetchData={setRefetchData}
      />
    </div>
  );
}

const TabelComponent = ({
  setUserType,
  setShowDeleteModal,
  setSelectedRowId,
  setOpen,
  allUsersData,
  isLoading,
  updateStatusHandler,
  setRowId,
  rowId,
  setShowStatusTogglerModal,
  showStatusTogglerModal,
}) => {
  const [anchorElUser, setAnchorElUser] = useState(null);
  // const [rowId, setRowId] = useState("");
  console.log("rowId:::::", rowId);
  const router = useRouter();
  if (isLoading) {
    return (
      <div>
        <LoaderTable />
      </div>
    );
  }
  if (!allUsersData) {
    return <div>No data available</div>;
  }
  const handleOpenUserMenu = (event) => {
    event.stopPropagation();
    setSelectedRowId(rowId);
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpen = () => {
    setSelectedRowId(rowId);
    setOpen(true);
    setAnchorElUser(null);
    setUserType(rowId?.roleId);
  };
  const handleDeleteModal = () => {
    setSelectedRowId(rowId);
    setShowDeleteModal(true);
    setAnchorElUser(null);
  };
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
  return (
    <>
      <Table
        columns={columns}
        enableRowSelection={false}
        data={allUsersData?.data || []}
        enableRowActions
        renderRowActions={({ cell, row }) => {
          return (
            <>
              <IconButton
                disableRipple={true}
                size="large"
                // edge="end"
                aria-label="account of current user"
                aria-haspopup="true"
                onClick={(event) => {
                  setRowId(cell?.row?.original);
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
                    // setUserId(cell?.row?.original?.userId)
                    router.push(
                      `/admin/user-management/${rowId.userId}?userRole=${row?.original?.role}`
                    );
                  }}
                >
                  {/* main 😁 */}
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
                <MenuItem
                  onClick={() => {
                    setShowStatusTogglerModal(true);
                    // updateStatusHandler();
                    setAnchorElUser(null);
                  }}
                >
                  {console.log("cell?.row?.original:::::", rowId)}
                  <ModeEditIcon sx={{ fontSize: "20px" }} />
                  <MuiTypography
                    variant="subtitle1"
                    fontWeight="400"
                    component="span"
                    ml={0.5}
                  >
                    {rowId?.isActive ? "InActive" : "Active"}
                  </MuiTypography>
                </MenuItem>
                <MenuItem onClick={handleOpen}>
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
                <MenuItem onClick={handleDeleteModal}>
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
        }}
      />
    </>
  );
};

const columns = [
  {
    header: "First Name",
    accessorKey: "firstName",
    Cell: ({ cell }) => (
      <Box display="flex" alignItems="center">
        <MuiTypography variant="body2" component="span" sx={{ mx: "10px" }}>
          {cell.row.original.firstName || " N/A"}
        </MuiTypography>
      </Box>
    ),
  },
  {
    header: "Last Name",
    accessorKey: "lastName",
    Cell: ({ cell }) => (
      <Box display="flex" alignItems="center">
        <MuiTypography variant="body2" component="span" sx={{ mx: "10px" }}>
          {cell.row.original.lastName ? cell.row.original.lastName : "N/A"}
        </MuiTypography>
      </Box>
    ),
  },
  {
    header: "Email",
    accessorKey: "email",
    Cell: ({ cell }) => (
      <Box display="flex" alignItems="center">
        <MuiTypography variant="body2" component="span" sx={{ mx: "10px" }}>
          {cell.row.original.email || "N/A "}
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
            {date === undefined ? "N/A" : moment(date).format("MM/DD/YYYY")}
          </MuiTypography>
        </Box>
      );
    },
  },
  {
    header: "Phone No",
    accessorKey: "phoneNo",
    Cell: ({ cell }) => (
      <Box display="flex" alignItems="center">
        <MuiTypography variant="body2" component="span" sx={{ mx: "10px" }}>
          {cell.row.original.phoneNo || "N/A"}
        </MuiTypography>
      </Box>
    ),
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
  {
    header: "Address",
    accessorKey: "address",
    Cell: ({ cell }) => (
      <Box display="flex" alignItems="center">
        <MuiTypography variant="body2" component="span" sx={{ mx: "10px" }}>
          {cell.row.original.address || "N/A"}
        </MuiTypography>
      </Box>
    ),
  },
  {
    header: "Status",
    accessorKey: "isActive",
    Cell: ({ cell }) => {
      const isActive = cell.row.original.isActive;
      console.log("====>", isActive); // This will log the value (true or false)

      return (
        <Box display="flex" alignItems="center">
          <MuiTypography variant="body2" component="span" sx={{ mx: "10px" }}>
            {isActive === true
              ? "Active"
              : isActive === false
              ? "Inactive"
              : "N/A"}
          </MuiTypography>
        </Box>
      );
    },
  },
];

const CustomRadioButton = ({ isDisabled, name, type, tittle, onClick }) => {
  return (
    <Box
      width="100%"
      border={`1px solid ${type === name ? "#E02828" : "#E2E5ED"}`}
      height="50px"
      borderRadius="4px"
      alignItems="center"
      display="flex"
      justifyContent="space-between"
      px={1}
      sx={{ cursor: "pointer" }}
      onClick={
        !isDisabled
          ? () => {
              onClick();
            }
          : null
      }
    >
      <Box alignItems="center" display="flex">
        <RadioButtonCheckedIcon
          sx={{ color: `${type === name ? "#E02828" : "#CCCCCC"}` }}
        />
        <MuiTypography
          variant="subtitle1"
          component="label"
          color={`${type !== name && "#CCCCCC"}`}
          sx={{ mx: 1 }}
        >
          {tittle}
        </MuiTypography>
      </Box>
      {type === name && <TaskAltIcon sx={{ color: "#E02828" }} />}
    </Box>
  );
};
