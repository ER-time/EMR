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
import { useState } from "react";
import { Box, Button, DotStatusBadge } from "@/components";
import MuiTypography from "@/components/core/Typography";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Loader1 } from "@/components/core/Loader/Loader";
import { useGetAllMedicationQuery } from "@/redux/slices/userProfile";

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

export default function Medications() {
  const [currentPage, setCurrentPage] = useState(1);
  const pathname = usePathname();
  const url = pathname.split("/");
  const patientId = url[url.length - 1];
  const payload = {
    pageNo: currentPage,
    pageSize: 10,
    patientId: patientId,
  };
  const getMedications = useGetAllMedicationQuery(payload);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  if (getMedications?.isLoading) {
    return (
      <Box>
        <Loader1 />
      </Box>
    );
  }

  return (
    <Grid>
      <Grid item xs={12}>
        <TabelComponent data={getMedications?.data?.data } />
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
          {currentPage} to {getMedications?.data?.data?.length}{" "}
          <span style={{ color: "#666666" }}>out of </span>
          {getMedications?.data?.totalCounts || 0} entries
        </MuiTypography>
       
        <Pagination
          count={ Math.ceil(getMedications?.data?.totalCounts / 10)}
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

const TabelComponent = ({data}) => {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const router = useRouter();

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <>
      <Table
        columns={columns}
        data={data|| []}
        enableRowSelection={false}
        enableRowActions={false}
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
    header: "Medicine",
    accessorKey: "medicineName",
  },
  {
    header: "Dose",
    accessorKey: "dose",
  },
  {
    header: "Dose Frequency",
    accessorKey: "doseFrequency",
  },
  {
    header: "Reason",
    accessorKey: "reason",
  },
];

// const data = [...Array(5)].map(() => ({
//   medicine: "Avelox 400mg",
//   dose: "1",
//   doseFreq: "Every 3 hour",
//   reason: "Lorem ipsum dolor sit amet consectetur. Nunc.",
// }));
