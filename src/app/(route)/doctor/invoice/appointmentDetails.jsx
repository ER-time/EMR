import { Avatar, Divider, IconButton } from "@mui/material";
import { Box } from "@/components";
import MuiTypography from "@/components/core/Typography";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { extractDateTimeComponents } from "@/lib/utils";
import moment from "moment";

export default function InvoiceDetails({
  detailsOpen,
  setDetailsOpen,
  rowData,
}) {
 
  const { data } = extractDateTimeComponents(rowData?.invoiceDate);
  const patientDataOFBirth = extractDateTimeComponents(rowData?.patientDOB);
  return (
    <Box
      bgcolor="#fff"
      boxShadow="0px 0px 24px 0px rgba(0, 0, 0, 0.04)"
      width="100%"
      borderRadius="12px"
      padding="20px 10px"
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
      </Box>

      <Box p="10px">
        <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
          <Box gridColumn="span 12">
            <MuiTypography
              variant="body2"
              component="h6"
              color="#999"
              padding="10px 0px"
            >
              Invoice Date
            </MuiTypography>

            <MuiTypography variant="body1" component="p" color="#333">
              {moment(data).format("MM/DD/YY") || "N/A"}
            </MuiTypography>
          </Box>
          <Box gridColumn="span 6">
            <MuiTypography
              variant="body2"
              component="h6"
              color="#999"
              paddingBottom="10px"
            >
              Status
            </MuiTypography>

            <Box style={{ display: "flex", alignItems: "center" }}>
              <FiberManualRecordIcon
                sx={{ color: "#E02828", marginRight: "5px", fontSize: "12px" }}
              />
              <MuiTypography variant="body1" component="p" color="#333">
                Paid
              </MuiTypography>
            </Box>
          </Box>
          <Box gridColumn="span 6">
            <MuiTypography
              variant="body2"
              component="h6"
              color="#999"
              paddingBottom="10px"
            >
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
              ${rowData?.invoiceAmount || "N/A"}
            </MuiTypography>
          </Box>

          <Box display="flex" justifyContent="space-between" p={2}>
            <MuiTypography variant="subtitle1" component="h6" color="#999">
              Due Amount
            </MuiTypography>

            <MuiTypography variant="h6" component="p" color="#333">
              $ 0
            </MuiTypography>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ mb: 2 }} />

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
                src="/images/sign-in-bg.png"
                sx={{ width: 70, height: 70 }}
              />
              <Box mx={2}>
                <MuiTypography
                  variant="body1"
                  component="h6"
                  color="#000"
                  fontWeight="500"
                >
                  {rowData?.patientPhoneNo || "N/A"}
                </MuiTypography>
                <MuiTypography variant="body2" component="p" color="#666666">
                  {rowData?.patientEmail || "N/A"}
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
              {moment(patientDataOFBirth?.date).format("MM/DD/YY")}
            </MuiTypography>
          </Box>
          <Box gridColumn="span 6">
            <MuiTypography variant="body2" component="h6" color="#999">
              Age
            </MuiTypography>

            <MuiTypography variant="body1" component="p" color="#333">
              35 Y
            </MuiTypography>
          </Box>
          <Box gridColumn="span 12">
            <MuiTypography variant="body2" component="h6" color="#999">
              Current Address
            </MuiTypography>

            <MuiTypography variant="body1" component="p" color="#333">
              {rowData?.patientAddress || "N/A"}
            </MuiTypography>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />
    </Box>
  );
}
