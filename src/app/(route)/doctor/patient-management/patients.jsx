"use client";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import styled from "styled-components";
import {
  Avatar,
  Grid,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Select,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Search } from "@mui/icons-material";
import { TimePicker } from "@mui/x-date-pickers";
import { useRouter } from "next/navigation";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Box } from "@/components";
import MuiTypography from "@/components/core/Typography";
import InputField from "@/components/core/Input";
import Table from "@/components/core/Table";
import Pagination from "@/components/core/Pagination";
import DatePicker from "@/components/core/DatePicker";
import { DeleteModal, PatientExportModal } from "@/components/webComponent";
import AddEditPatientModal from "@/components/webComponent/addEditPatientModal";
import { useSession } from "next-auth/react";
import { Loader1 } from "@/components/core/Loader/Loader";
import { convertDateToISOFormat, convertToUTCDate } from "@/lib/utils";
import { useGetDoctorAllPatientsMutation } from "@/redux/slices/doctors";
import ChatHistoryDrawer from "./chatHistoryDrawer";
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

const INPUT_LABEL_PROPS = {
  variant: "subtitle1",
  component: "label",
  fontWeight: "500",
  spacing: "0.1px",
};

const INPUT_FIELD_PROPS = {
  label: "",
  fullWidth: true,
  variant: "standard",
};

const INPUT_FIELD_STYLES = {
  sx: {
    margin: "0px 0px",
    height: "50px",
    "& fieldset": { border: "1px solid #E2E5ED" },
  },
};

export default function PatientManagment() {
  const [editPatientModal, setEditPatientModal] = useState(false);
  const session = useSession();
  const [patientExportModal, setPatientExportModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [startDate, setStartDate] = useState();
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [GetDoctorAllPatients, { data, isLoading }] =
    useGetDoctorAllPatientsMutation();
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const [dateRange, setDateRange] = useState({
    endDateISO: null,
    startDateISO: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      await GetDoctorAllPatients({
        pageNo: currentPage,
        pageSize: 10,
        // dateTime: startDate === "Invalid date" ? null : startDate,
        endDate: convertToUTCDate(dateRange?.endDateISO) || null,
        startDate: convertToUTCDate(dateRange?.startDateISO) || null,
        search: searchValue,
        doctorId: session?.data?.user?.user?.userId,
      });
    };
    fetchData();
  }, [session, currentPage, searchValue, startDate, dateRange]);

  const handleDateChange = (start, end) => {
    const startDateISO = start ? start.toISOString() : null;
    const endDateISO = end ? end.toISOString() : null;
    setDateRange({ endDateISO, startDateISO });
    const payload = {
      pageNo: currentPage,
      pageSize: 10,
      doctorId: session?.data?.user?.user?.userId,
      startDate: convertToUTCDate(startDateISO),
      endDate: convertToUTCDate(endDateISO),
    };
    GetDoctorAllPatients(payload);
  };


  const onSearchHandler = (e) => {
    setSearchValue(e.target.value);
    if (e.target.value.length > 3 || e.target.value.length === 0) {
      const payload = {
        pageNo: currentPage,
        pageSize: 10,
        search: e.target.value,
        doctorId: session?.data?.user?.user?.userId,
        endDate: convertToUTCDate(dateRange?.endDateISO) || null,
        startDate: convertToUTCDate(dateRange?.startDateISO) || null,
      };

      GetDoctorAllPatients(payload);
    }
  };

  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    currentAddress: "",
  };

  const onSubmit = (values) => {
    console.log("Form Values", values);
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required("Field is Required!"),
    lastName: Yup.string().required("Field is Required!"),
    email: Yup.string().required("Invalid Email Format!"),
    currentAddress: Yup.string().required("Field is Required!"),
  });

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

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
              <MuiTypography
                sx={{ mt: 2 }}
                variant="h6"
                component="h6"
                fontWeight="600"
              >
                Patient Management
              </MuiTypography>
              {/* <Button
                variant="contain"
                bg="#E02828"
                color="#fff"
                height="45px"
                startIcon={<AddIcon />}
                radius="12px"
                sx={{ margin: "15px 0px" }}
                onClick={() => setOpen(true)}
              >
                Add Patient
              </Button> */}
            </Box>

            <Box
              display="flex"
              flexWrap="wrap"
              justifyContent="flex-end"
              alignItems="center"
              px="20px"
              boxSizing="border-box"
              sx={{ display: { xs: "none", sm: "flex" }, margin: "auto" }}
            >
              {/* <Button
                variant="contain"
                bg="#348AF4"
                color="#fff"
                height="40px"
                radius="6px"
                onClick={() => setPatientExportModal(true)}
              >
                Export to Excel
              </Button> */}
              <DateRangePickerComp onDateChange={handleDateChange} />
              <InputField
                value={searchValue} // Set value of InputField to the state
                onChange={onSearchHandler}
                id="email"
                placeholder="Search"
                {...INPUT_FIELD_PROPS_SEARCH}
                sx={INPUT_FIELD_STYLES_SEARCH.sx}
                variant="standard"
                type="text"
                startAdornment={
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                }
              />
            </Box>
            <TabelComponent
              isLoading={isLoading}
              data={data?.data}
              setEditPatientModal={setEditPatientModal}
              setSelectedRecord={setSelectedRecord}
              selectedRecord={selectedRecord}
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
                {currentPage} to {(data && data?.data?.length) || 0}{" "}
                <span style={{ color: "#666666" }}>out of </span>
                {data?.totalCounts || 0} entries
              </MuiTypography>
              <StyledPagination>
                <Pagination
                  count={Math.ceil(data?.totalCounts / 10)}
                  onPageChange={handlePageChange}
                />
              </StyledPagination>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* {open && (
        <AddEditPatientModal
          open={open}
          handleClose={() => setOpen(false)}
          tittle="Add Patient"
        />
      )} */}
      {editPatientModal && (
        <AddEditPatientModal
          open={editPatientModal}
          handleClose={() => setEditPatientModal(false)}
          tittle="Edit Patient"
        />
      )}

      {patientExportModal && (
        <PatientExportModal
          open={patientExportModal}
          handleClose={() => setPatientExportModal(false)}
        />
      )}
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
  toggleDrawer,
  setEditPatientModal,
  data,
  isLoading,
  setSelectedRecord,
  selectedRecord,
}) => {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const router = useRouter();

  const handleOpenUserMenu = (event) => {
    event.stopPropagation();
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  if (isLoading) {
    return <Loader1 />;
  }
  return (
    <>
      <Table
        columns={columns}
        data={data || []}
        enableRowSelection={false}
        renderRowActions={({ row, cell }) => (
          <IconButton
            disableRipple={true}
            size="large"
            // edge="end"
            aria-label="account of current user"
            aria-haspopup="true"
            onClick={(event) => {
              setSelectedRecord(cell?.row?.original);
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
          onClick={() => {
            router.push(
              `/doctor/patient-management/${selectedRecord?.patientId}?inboxId=${selectedRecord?.inboxId}`
            );
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
            View
          </MuiTypography>
        </MenuItem>
        {/* <MenuItem
          onClick={() => {
            handleCloseUserMenu();
            setEditPatientModal(true);
          }}
        >
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
            handleCloseUserMenu();
            setDeleteModal(true);
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
          tittle="Delete Patient"
          onConfirm={() => setDeleteModal(false)}
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
        {/* <Avatar sx={{ bgcolor: "rgb(224, 40, 40)", width: 40, height: 40 }}>
          OP
        </Avatar> */}
        <MuiTypography variant="body2" component="span" sx={{ mx: "10px" }}>
          {cell.row.original.patient}
        </MuiTypography>
      </Box>
    ),
  },
  {
    header: "Email",
    accessorKey: "patientEmail",
    accessorFn: (row) => {
      return <div>{row.patientEmail || "N/A"}</div>;
    },
  },
  {
    header: "Reason",
    accessorKey: "reason",
    accessorFn: (row) => {
      return <div>{row.reason || "N/A"}</div>;
    },
  },
  // {
  //   header: "Center",
  //   accessorKey: "center",
  // },
  // {
  //   header: "Feedback",
  //   accessorKey: "feedback",
  //   accessorFn: (row) => {
  //     return <div>{row.feedback || "N/A"}</div>;
  //   },
  // },
  {
    header: "Time Period",
    accessorKey: "timePeriod",
    accessorFn: (row) => {
      return <div>{row.timePeriod || "N/A"}</div>;
    },
  },
];
