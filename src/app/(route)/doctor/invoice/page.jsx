"use client";

import { useEffect, useState } from "react";
import {
  Avatar,
  Drawer,
  Grid,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
} from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
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
import InvoiceDetails from "./appointmentDetails";
import useScreenWidth from "@/hooks/useScreenWidth";

import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import { DeleteModal } from "@/components/webComponent";
import { useGetAllInvoicesMutation } from "@/redux/slices/invoices";
import { useSession } from "next-auth/react";
import { USER_ROLE } from "@/config";
import { convertDateToISOFormat, extractDateTimeComponents } from "@/lib/utils";
import moment from "moment";

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

const StyledPagination = styled.div`
  @media (max-width: 669px) {
    width: 100%;
    display: flex;
    justify-content: end;
  }
`;
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

export default function Invoices() {
  const screenWidth = useScreenWidth();
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [startDate, setStartDate] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowData, setRowData] = useState(null);
  const session = useSession();
  const userData = session?.data?.user?.user;
  const [
    getAllInvoices,
    { isLoading, isError, isSuccess, data: AllInvoicesData, error },
  ] = useGetAllInvoicesMutation();

  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  useEffect(() => {
    const fetchData = async () => {
      await getAllInvoices({
        pageNo: currentPage,
        pageSize: 10,
        // invoiceDate: startDate,
        invoiceDate: startDate === "Invalid date" ? null : startDate,
        search: searchValue,
        userId: userData?.userId,
        userRoleId: USER_ROLE.doctor,
      });
    };
    fetchData();
  }, [currentPage, searchValue, startDate]);

  const onSearchHandler = (e) => {
    setSearchValue(e.target.value);
    if (e.target.value.length > 3 || e.target.value.length === 0) {
      const payload = {
        pageNo: currentPage,
        pageSize: 10,
        search: e.target.value,
        userId: userData?.userId,
        userRoleId: USER_ROLE.doctor,
      };

      getAllInvoices(payload);
    }
  };

  const onDateSearchHandler = (date) => {
    if (date) {
      setStartDate(convertDateToISOFormat(date));
      const payload = {
        pageNo: currentPage,
        pageSize: 10,
        invoiceDate: convertDateToISOFormat(date),
        userId: userData?.userId,
        userRoleId: USER_ROLE.doctor,
      };
      getAllInvoices(payload);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const [detailsOpen, setDetailsOpen] = useState(false);

  return (
    <div>
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
            <Box
              p="20px"
              display="flex"
              flexWrap="wrap"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box width="auto">
                <MuiTypography variant="h6" component="h6" fontWeight="600">
                  Invoices
                </MuiTypography>
              </Box>

              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                flexWrap="wrap"
                width="auto"
                sx={{
                  width: { md: "auto", xs: "100%" },
                }}
              >
                {/* <Box width="auto">
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
                    onClick={() => setFilter("paid")}
                    sx={BUTTON_FILTER_XS.sx}
                    {...BUTTON_FILTER}
                    bg={`${filter === "paid" ? "#348AF4" : "#F2F3F2"}`}
                    color={`${filter === "paid" ? "#fff" : "#636967"}`}
                  >
                    Paid
                  </Button>

                  <Button
                    onClick={() => setFilter("unpaid")}
                    sx={BUTTON_FILTER_XS.sx}
                    {...BUTTON_FILTER}
                    bg={`${filter === "unpaid" ? "#348AF4" : "#F2F3F2"}`}
                    color={`${filter === "unpaid" ? "#fff" : "#636967"}`}
                  >
                    Unpaid
                  </Button>
                </Box> */}

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
                  <DatePicker
                    height="40px"
                    width="160px"
                    border="1px solid #e5e6e6"
                    radius="6px"
                    fsize="14px"
                    value={startDate}
                    onChange={onDateSearchHandler}
                  />
                  <InputField
                    id="email"
                    placeholder="Search"
                    {...INPUT_FIELD_PROPS_SEARCH}
                    sx={INPUT_FIELD_STYLES_SEARCH.sx}
                    value={searchValue}
                    onChange={onSearchHandler}
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
              AllInvoicesData={AllInvoicesData}
              detailsOpen={detailsOpen}
              setDetailsOpen={setDetailsOpen}
              setRowData={setRowData}
            />
            <Box
              display="flex"
              justifyContent="space-between"
              pb="20px"
              px="20px"
              flexWrap="wrap"
              sx={{ boxSizing: "border-box" }}
            >
              <MuiTypography
                variant="span"
                component="span"
                color="#1C1D21"
                fontWeight="400"
              >
                {currentPage} to {AllInvoicesData?.data?.length}{" "}
                <span style={{ color: "#666666" }}>out of </span>
                {AllInvoicesData?.totalCounts || 0} entries
              </MuiTypography>
              <StyledPagination>
                <Pagination
                  count={Math.ceil(AllInvoicesData?.totalCounts / 10) || 0}
                  onPageChange={handlePageChange}
                />
              </StyledPagination>
            </Box>
          </Box>
        </Grid>
        {detailsOpen === true && screenWidth >= 1400 && (
          <Grid item xs={12} lg={4}>
            <InvoiceDetails
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
            <InvoiceDetails
              detailsOpen={detailsOpen}
              setDetailsOpen={setDetailsOpen}
              rowData={rowData}
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

const TabelComponent = ({
  setDetailsOpen,
  detailsOpen,
  AllInvoicesData,
  setRowData,
}) => {
  const [deleteModal, setDeleteModal] = useState(false);

  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenUserMenu = (event) => {
    event.stopPropagation();
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const [rowSelection, setRowSelection] = useState({});
  return (
    <>
      <Table
        enableRowSelection={false}
        enableRowActions={false}
        getRowId={(row) => row.userId} //give each row a more useful id
        muiTableBodyRowProps={({ row }) => ({
          onClick: () => {
            setRowSelection({ [row.id]: !rowSelection[row.id] }); // Update state to select only the clicked row
            setRowData(row?.original); // Set row data
            setDetailsOpen(true); // Open details
          },
          selected: rowSelection[row.id], // Apply selected style based on selection state
          sx: {
            cursor: "pointer",
            backgroundColor: rowSelection[row.id]
              ? "#fff5f5 !important;"
              : "inherit", // Change background color if selected
          },
        })}
        onRowSelectionChange={setRowSelection} //connect internal row selection state to your own
        state={{ rowSelection }}
        columns={columns}
        data={AllInvoicesData?.data || []}
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
            handleCloseUserMenu();
          }}
        >
          <VisibilityIcon sx={{ fontSize: "20px" }} />
          <MuiTypography
            // onClick={() => router.push("/user-managment/2")}
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
        </MenuItem>
      </StyledMenu>
      {deleteModal && (
        <DeleteModal
          open={deleteModal}
          handleClose={() => setDeleteModal(false)}
          tittle="Delete Invoice"
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
    header: "Invoice Date",
    accessorKey: "invoiceDate",
    accessorFn: (row) => {
      const { date } = extractDateTimeComponents(row?.invoiceDate);
      return <div>{moment(date).format("MM/DD/YY")}</div>;
    },
    width: 100,
  },
  {
    header: "Total Invoice",
    accessorKey: "invoiceAmount",
    accessorFn: (row) => {
      return <div>$ {row.invoiceAmount}</div>;
    },
  },
  // {
  //   header: "Due Amount",
  //   accessorKey: "dueAmount",
  // },
  {
    header: "Status",
    accessorKey: "status",
    accessorFn: (row) => {
      let color;
      switch (row.status) {
        case "Canceled":
          color = "#E02828"; // Red color for canceled
          break;
        case "Pending":
          color = "#FA9638"; // Orange color for pending
          break;
        case "Upcoming":
          color = "#348AF4"; // Blue color for upcoming
          break;
        case "Missing":
          color = "#D64242"; // Gray color for missing
          break;
        default:
          color = "#34C240"; // Black color for other statuses
      }

      return (
        <div style={{ display: "flex", alignItems: "center" }}>
          <FiberManualRecordIcon
            sx={{ color: color, marginRight: "5px", fontSize: "12px" }}
          />
          <p>Paid</p>
        </div>
      );
    },
  },
  {
    header: "Payment Method",
    accessorKey: "paymentMethod",
    accessorFn: (row) => {
      return <div>Online</div>;
    },
  },
  {
    header: "",
    accessorKey: "payBtn",
    Cell: ({ cell, row }) => {
      if (cell.row.original.paymentRequired) {
        return (
          <Button
            sx={{ mr: 1, fontSize: "18px" }}
            variant="contain"
            bg="#E02828"
            color="#FFFFFF"
            height="52px"
            radius="12px"
            width="32px"
            // onClick={() => handlePayButtonClick(row.original.id)}
          >
            {cell.row.original.payButtonText}
          </Button>
        );
      } else {
        return null;
      }
    },
  },
];

const data = [
  {
    id: 1,
    patients: "Wanda Maximoff",
    invoiceDate: "8/26/2023",
    totalInvoice: "$932.51",
    dueAmount: "$55.00",
    status: (
      <div style={{ display: "flex", alignItems: "center" }}>
        <FiberManualRecordIcon
          sx={{ color: "#34C240", marginRight: "5px", fontSize: "12px" }}
        />
        <p>Paid</p>
      </div>
    ),
    paymentMethod: "Cash",
  },
  {
    id: 2,
    patients: "Wanda Maximoff",
    invoiceDate: "8/26/2023",
    totalInvoice: "09:30 pm",
    dueAmount: "$100.00",
    status: (
      <div style={{ display: "flex", alignItems: "center" }}>
        <FiberManualRecordIcon
          sx={{ color: "#D64242", marginRight: "5px", fontSize: "12px" }}
        />
        <p>Unpaid</p>
      </div>
    ),
    paymentMethod: "Bank Transfer",
  },
  {
    id: 3,
    patients: "Wanda Maximoff",
    invoiceDate: "8/26/2023",
    totalInvoice: "09:30 pm",
    dueAmount: "$100.00",
    status: (
      <div style={{ display: "flex", alignItems: "center" }}>
        <FiberManualRecordIcon
          sx={{ color: "#D64242", marginRight: "5px", fontSize: "12px" }}
        />
        <p>Unpaid</p>
      </div>
    ),
    paymentMethod: "Bank Transfer",
  },
  {
    id: 4,
    patients: "Wanda Maximoff",
    invoiceDate: "8/26/2023",
    totalInvoice: "09:30 pm",
    dueAmount: "$100.00",
    status: (
      <div style={{ display: "flex", alignItems: "center" }}>
        <FiberManualRecordIcon
          sx={{ color: "#34C240", marginRight: "5px", fontSize: "12px" }}
        />
        <p>Paid</p>
      </div>
    ),
    paymentMethod: "Cash",
  },
  {
    id: 5,
    patients: "Wanda Maximoff",
    invoiceDate: "8/26/2023",
    totalInvoice: "09:30 pm",
    dueAmount: "$100.00",
    status: (
      <div style={{ display: "flex", alignItems: "center" }}>
        <FiberManualRecordIcon
          sx={{ color: "#34C240", marginRight: "5px", fontSize: "12px" }}
        />
        <p>Paid</p>
      </div>
    ),
    paymentMethod: "Cash",
  },
  {
    id: 6,
    patients: "Wanda Maximoff",
    invoiceDate: "8/26/2023",
    totalInvoice: "09:30 pm",
    dueAmount: "$100.00",
    status: (
      <div style={{ display: "flex", alignItems: "center" }}>
        <FiberManualRecordIcon
          sx={{ color: "#34C240", marginRight: "5px", fontSize: "12px" }}
        />
        <p>Paid</p>
      </div>
    ),
    paymentMethod: "Cash",
  },
];
