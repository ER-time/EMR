import { Avatar, Divider, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Box } from "@/components";
import MuiTypography from "@/components/core/Typography";
import moment from "moment";

export default function InvoiceDetails({rowData, detailsOpen, setDetailsOpen }) {
  return (
    <Box
      bgcolor="#fff"
      boxShadow="0px 0px 24px 0px rgba(0, 0, 0, 0.04)"
      width="100%"
      borderRadius="12px"
    >
      <Box display="flex" alignItems="center" px="10px">
        <Box display="flex" alignItems="center">
          <CloseIcon
            onClick={() => setDetailsOpen(false)}
            sx={{ cursor: "pointer" }}
          />
          <MuiTypography
            variant="h6"
            component="h6"
            color="#000"
            sx={{ mx: 1 }}
          >
            Invoice Preview
          </MuiTypography>
        </Box>
        {/* <IconButton
          disableRipple={true}
          size="large"
          aria-label="account of current user"
          aria-haspopup="true"
          // onClick={handleOpenUserMenu}
          role="button"
          tabIndex="0"
          onKeyDown={(e) => {
            e.stopPropagation();
          }}
          color="inherit"
        >
          <MoreVertIcon />
        </IconButton> */}
      </Box>

      <Box px="10px">
        <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
          <Box gridColumn="span 12">
            <MuiTypography variant="body2" component="h6" color="#999">
              Invoice Date
            </MuiTypography>

            <MuiTypography variant="body1" component="p" color="#333">
            {moment(rowData?.invoiceDate).format("dddd, MMMM D, YYYY") ||  'N/A'}
            </MuiTypography>
          </Box>
          <Box gridColumn="span 6">
            <MuiTypography variant="body2" component="h6" color="#999">
              Status
            </MuiTypography>

            <MuiTypography variant="body1" component="p" color="#333">
             {rowData?.status||'N/A'}
            </MuiTypography>
          </Box>
          <Box gridColumn="span 6">
            <MuiTypography variant="body2" component="h6" color="#999">
              Payment Method
            </MuiTypography>

            <MuiTypography variant="body1" component="p" color="#333">
              Online
            </MuiTypography>
          </Box>
        </Box>
        <Box
          bgcolor="#FBFBFB"
          borderRadius="4px"
          maxWidth="450px"
          m="20px auto"
        >
          <Box display="flex" justifyContent="space-between" p={2}>
            <MuiTypography variant="subtitle1" component="h6" color="#999">
              Total Invoice
            </MuiTypography>

            <MuiTypography variant="h6" component="p" color="#333">
              $ {rowData?.invoiceAmount || "N/A"}
            </MuiTypography>
          </Box>

          {/* <Box display="flex" justifyContent="space-between" p={2}>
            <MuiTypography variant="subtitle1" component="h6" color="#999">
              Due Amount
            </MuiTypography>

            <MuiTypography variant="h6" component="p" color="#333">
              $50.00
            </MuiTypography>
          </Box> */}
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box px="10px">
        <Box display="flex" alignItems="center" my={2}>
          <PersonIcon sx={{ color: "#E02828", fontSize: "35px" }} />
          <MuiTypography
            variant="body1"
            component="span"
            fontWeight="500"
            color="#E02828"
          >
            Patient Details
          </MuiTypography>
        </Box>
        <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
          <Box gridColumn="span 12">
            <Box display="flex" alignItems="center">
              <Avatar
                alt="Remy Sharp"
                src="https://ioctane.nyc3.digitaloceanspaces.com/08052024173202_download.png.png?AWSAccessKeyId=DO00ATCWQ9MLZ47VQ3JX&Expires=1715448724&Signature=cesfJRkiqIb6U6P6%2B0lX8O4M%2B6E%3D"
                sx={{ width: 70, height: 70 }}
              />
              <Box mx={2}>
                <MuiTypography
                  variant="body1"
                  component="h6"
                  color="#000"
                  fontWeight="500"
                >
                  {rowData.patient || "N/A"}
                </MuiTypography>
                <MuiTypography variant="body2" component="p" color="#333">
                 {rowData?.patientEmail ||' N/A'}
                </MuiTypography>
              </Box>
            </Box>
          </Box>

          <Box gridColumn="span 6">
            <MuiTypography variant="body2" component="h6" color="#999">
              Phone Number
            </MuiTypography>

            <MuiTypography variant="body1" component="p" color="#333">
              {rowData?.patientPhoneNo || "N/A"}
            </MuiTypography>
          </Box>
          <Box gridColumn="span 6">
            <MuiTypography variant="body2" component="h6" color="#999">
              Gender
            </MuiTypography>

            <MuiTypography variant="body1" component="p" color="#333">
              {rowData?.patientGender || "N/A"}
            </MuiTypography>
          </Box>
          <Box gridColumn="span 6">
            <MuiTypography variant="body2" component="h6" color="#999">
              Date of Birth
            </MuiTypography>

            <MuiTypography variant="body1" component="p" color="#333">
             { moment(rowData?.patientDOB).format("dddd, MMMM D, YYYY") || "N/A" }
            </MuiTypography>
          </Box>
          <Box gridColumn="span 6">
            <MuiTypography variant="body2" component="h6" color="#999">
              Age
            </MuiTypography>

            <MuiTypography variant="body1" component="p" color="#333">
             {rowData?.patientAge }
            </MuiTypography>
          </Box>
          <Box gridColumn="span 12">
            <MuiTypography variant="body2" component="h6" color="#999">
              Current Address
            </MuiTypography>

            <MuiTypography variant="body1" component="p" color="#333">
             {rowData?.patientAddress || 'N/A'}
            </MuiTypography>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />
    </Box>
  );
}
