import { useEffect, useState } from "react";
import {
  Avatar,
  Grid,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
} from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { Search } from "@mui/icons-material";
import styled from "styled-components";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box } from "@/components";
import MuiTypography from "@/components/core/Typography";
import Table from "@/components/core/Table";
import Pagination from "@/components/core/Pagination";
import DatePicker from "@/components/core/DatePicker";
import InputField from "@/components/core/Input";
import { useGetAllInvoicesMutation } from "@/redux/slices/invoices";
import { convertDateToISOFormat, extractDateTimeComponents } from "@/lib/utils";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import dayjs from "dayjs";
import moment from "moment";

export default function Invoices() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [startDate, setStartDate] = useState(null);
  const pathname = usePathname();
  const url = pathname.split("/");
  const lastItem = url[url.length - 1];
  const [
    getAllInvoices,
    { isLoading, isError, isSuccess, data: AllInvoicesData, error },
  ] = useGetAllInvoicesMutation();

  useEffect(() => {
    const fetchData = async () => {
      await getAllInvoices({
        pageNo: currentPage,
        pageSize: 10,
        invoiceDate: convertDateToISOFormat(startDate),
        search:searchValue,
        userId:lastItem
      });
    };
    fetchData();
  }, [currentPage,searchValue]);

  const onSearchHandler = (e) => {
    setSearchValue(e.target.value);
    if (e.target.value.length > 3 ||  e.target.value.length === 0) {
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
      setStartDate(date);
      const payload = {
        pageNo: currentPage,
        pageSize: 10,
        invoiceDate:  moment(new Date(date)).format("YYYY-MM-DD"),
      };
      getAllInvoices(payload);
    }
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
          <MuiTypography variant="h6" component="h6" fontWeight="600">
            Invoices
          </MuiTypography>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            flexWrap="wrap"
          >

            <Box
              display="flex"
              flexWrap="wrap"
              justifyContent="flex-end"
              alignItems="center"
              boxSizing="border-box"
              width="auto"
              sx={{ display: { xs: "none", sm: "flex" }, marginLeft: "auto" }}
            >
              <DatePicker
                height="40px"
                width="160px"
                border="1px solid #e5e6e6"
                radius="6px"
                fsize="14px"
                value={dayjs(startDate)}
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

        <TabelComponent isLoading={isLoading}  AllInvoicesData={AllInvoicesData}/>

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
          {currentPage} to {AllInvoicesData?.data?.length}{" "}
          <span style={{ color: "#666666" }}>out of </span>
          {AllInvoicesData?.totalCounts || 0} entries
        </MuiTypography>
      

          <Pagination count={ Math.ceil(AllInvoicesData?.totalCounts / 10) || 0} onPageChange={handlePageChange} />
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

const TabelComponent = ({isLoading,AllInvoicesData}) => {
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
      enableRowSelection={false}
        columns={columns}
        data={AllInvoicesData?.data || []}
        defaultColumn={{
          maxSize: 0,
          minSize: 0,
          size: 0,
        }}
        enableRowActions={false}
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
    header: "Patients",
    accessorKey: "patient",
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
    width: "80px",
  },

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
    header: "Invoice Date",
    accessorKey: "invoiceDate",
    accessorFn: (row) => {
      const { date } = extractDateTimeComponents(row?.invoiceDate);
      return <div>{date}</div>;
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
  //   accessorKey: "invoiceAmount",
  // },
  {
    header: "Status",
    accessorKey: "status",
    accessorFn: (row) => {
      let color;
      switch (row.status) {
        case "Canceled":
          color = "#E02828"; 
          break;
        case "Pending":
          color = "#FFA500"; 
          break;
        case "Booked":
          color = "#007bff"; 
          break;
        case "Missed":
          color = "#6c757d"; 
          break;
        default:
          color = "#000000";
      }
  
      return (
        <div style={{ display: "flex", alignItems: "center" }}>
          <FiberManualRecordIcon
            sx={{ color: color, marginRight: "5px", fontSize: "12px" }}
          />
          <p>{row.status}</p>
        </div>
      );
    }
  }
  // {
  //   header: "Paument Method",
  //   accessorKey: "paymentMethod",
  // },
];

const data = [...Array(5)].map(() => ({
  patients: "",
  doctor: "",
  invoiceDate: "28/10/2012",
  patient: "Wanda maxioff",
  doctor: "Dr Szeek",
  totalAmount: "3334",
  dueAmount: "1500",
  status: "pending",
  paymentMethod: "Card",
}));
