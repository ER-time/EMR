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
import styled from "styled-components";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Search } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import VisibilityIcon from "@mui/icons-material/Visibility";
import InvoiceDetails from "./invoiceDetails";
import useScreenWidth from "@/hooks/useScreenWidth";
import { Box } from "@/components";
import MuiTypography from "@/components/core/Typography";
import InputField from "@/components/core/Input";
import Table from "@/components/core/Table";
import Pagination from "@/components/core/Pagination";
import DatePicker from "@/components/core/DatePicker";
import { useGetAllInvoicesMutation } from "@/redux/slices/invoices";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { convertDateToISOFormat, extractDateTimeComponents } from "@/lib/utils";
import { LoaderTable } from "@/components/core/Loader/Loader";
import moment from "moment";

const StyledPagination = styled.div`
  @media (max-width: 669px) {
    width: 100%;
    display: flex;
    justify-content: end;
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

export default function Invoices() {
  const screenWidth = useScreenWidth();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [rowData, setRowData] = useState("");
  const [
    getAllInvoices,
    { isLoading, isError, isSuccess, data: AllInvoicesData, error },
  ] = useGetAllInvoicesMutation();

  useEffect(() => {
    const fetchData = async () => {
      await getAllInvoices({
        pageNo: currentPage,
        pageSize: 10,
        invoiceDate:  startDate === "Invalid date" ? null : startDate,
        search: searchValue,
      });
    };
    fetchData();
  }, [currentPage, startDate]);

  const onSearchHandler = (e) => {
    setSearchValue(e.target.value);
    if (e.target.value.length > 3 || e.target.value.length === 0) {
      const payload = {
        pageNo: currentPage,
        pageSize: 10,
        search: e.target.value,
      };

      getAllInvoices(payload);
    }
  };

  const onDateSearchHandler = (date) => {
    if (date) {
      console.log("date",date);
      setStartDate(convertDateToISOFormat(date));
      const payload = {
        pageNo: currentPage,
        pageSize: 10,
        invoiceDate: convertDateToISOFormat(date),
      };
      getAllInvoices(payload);
    }
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
                    variant="standard"
                    startAdornment={
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    }
                    value={searchValue}
                    onChange={onSearchHandler}
                  />
                </Box>
              </Box>
            </Box>

            <TabelComponent
              setRowData={setRowData}
              AllInvoicesData={AllInvoicesData}
              isLoading={isLoading}
              detailsOpen={detailsOpen}
              setDetailsOpen={setDetailsOpen}
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
              rowData={rowData}
              detailsOpen={detailsOpen}
              setDetailsOpen={setDetailsOpen}
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
              rowData={rowData}
              detailsOpen={detailsOpen}
              setDetailsOpen={setDetailsOpen}
            />
          </Drawer>
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
      border-radius: 12px;
    }
    .MuiMenu-list li:hover {
      background: #fce9e9;
      color: #e02828;
    }
  }
`;

const TabelComponent = ({
  setRowData,
  setDetailsOpen,
  AllInvoicesData,
  isLoading,
}) => {
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
      <Box>
        <LoaderTable />
      </Box>
    );
  }
  return (
    <>
      <Table
        enableRowSelection={false}
        columns={columns}
        data={AllInvoicesData?.data || []}
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
        muiTableBodyRowProps={({ row }) => ({
          onClick: () => {
            setDetailsOpen(true);
          },
          // selected: rowSelection[row.id],
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
        <MenuItem onClick={() => setDetailsOpen(true)}>
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
        {/* 
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
        </MenuItem> */}
      </StyledMenu>
    </>
  );
};

const columns = [
  {
    header: "Patients",
    accessorKey: "patient",
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
    width: "80px",
  },

  {
    header: "Doctors",
    accessorKey: "doctor",
    Cell: ({ cell }) => (
      <Box display="flex" alignItems="center">
        <MuiTypography variant="body2" component="span" sx={{ mx: "10px" }}>
          {cell.row.original.doctor}
        </MuiTypography>
      </Box>
    ),
    width: "80px",
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
      return <div>${row.invoiceAmount}</div>;
    },
  },
  // {
  //   header: "Due Amount",
  //   accessorKey: "invoiceAmount",
  // },
  {
    header: "Status",
    accessorKey: "status",
    accessorFn: (row) => {
      return (
        <div style={{ display: "flex", alignItems: "center" }}>
          <FiberManualRecordIcon
            sx={{ color: "#34C240", marginRight: "5px", fontSize: "12px" }}
          />
          <p>paid</p>
        </div>
      );
    },
  },
  // {
  //   header: "Paument Method",
  //   accessorKey: "paymentMethod",
  // },
];
