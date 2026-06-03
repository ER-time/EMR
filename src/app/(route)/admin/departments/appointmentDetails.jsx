import { Avatar, Divider, IconButton } from "@mui/material";
import { Box } from "@/components";
import MuiTypography from "@/components/core/Typography";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { extractDateTimeComponents } from "@/lib/utils";
import moment from "moment";

export default function AppointmentDetails({
  rowData,
  detailsOpen,
  setDetailsOpen,
}) {
  const { time } = extractDateTimeComponents(rowData?.startDateTime);
  return (
    <Box
      bgcolor="#fff"
      boxShadow="0px 0px 24px 0px rgba(0, 0, 0, 0.04)"
      width="100%"
      borderRadius="12px"
      p="10px"
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
            Appointment Preview
          </MuiTypography>
        </Box>
      </Box>

      <Box px="10px">
        <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
          <Box gridColumn="span 6">
            <MuiTypography variant="body2" component="h6" color="#999">
              Appoitment Date
            </MuiTypography>

            <MuiTypography variant="body1" component="p" color="#333">
              {moment(rowData.startDateTime).format("MM/DD/YY")}
            </MuiTypography>
          </Box>
          <Box gridColumn="span 6">
            <MuiTypography variant="body2" component="h6" color="#999">
              Appointment Free
            </MuiTypography>

            <MuiTypography variant="body1" component="p" color="#333">
              ${rowData?.amount}
            </MuiTypography>
          </Box>
          <Box gridColumn="span 6">
            <MuiTypography variant="body2" component="h6" color="#999">
              Appoitment Time
            </MuiTypography>

            <MuiTypography variant="body1" component="p" color="#333">
              {time || "N/A"}
            </MuiTypography>
          </Box>
          <Box gridColumn="span 6">
            <MuiTypography variant="body2" component="h6" color="#999">
              Status
            </MuiTypography>

            <MuiTypography variant="body1" component="p" color="#333">
              {rowData?.status || "N/A"}
            </MuiTypography>
          </Box>
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
                src={
                  rowData?.PatientImage !== null
                    ? rowData?.PatientImage
                    : "/images/placeholderImage.png"
                }
                sx={{ width: 70, height: 70 }}
              />
              <Box mx={2}>
                <MuiTypography
                  variant="body1"
                  component="h6"
                  color="#000"
                  fontWeight="500"
                >
                  {rowData?.patient || "N/A"}
                </MuiTypography>
                <MuiTypography variant="body2" component="p" color="#333">
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
              {moment(rowData.patientDOB).format("MM/DD/YY")}
            </MuiTypography>
          </Box>
          {/* <Box gridColumn="span 6">
            <MuiTypography variant="body2" component="h6" color="#999">
              Age
            </MuiTypography>

            <MuiTypography variant="body1" component="p" color="#333">
              {rowData?.patientAge || "35 Y"}
            </MuiTypography>
          </Box> */}
          <Box gridColumn="span 6">
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

      <Box px="10px">
        <Box display="flex" alignItems="center" my={2}>
          <PersonIcon sx={{ color: "#E02828", fontSize: "35px" }} />
          <MuiTypography
            variant="body1"
            component="span"
            fontWeight="500"
            color="#E02828"
          >
            Dcotor Details
          </MuiTypography>
        </Box>
        <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
          <Box gridColumn="span 12">
            <Box display="flex" alignItems="center">
              <Avatar
                alt="Remy Sharp"
                src={
                  rowData?.DoctorImage !== null
                    ? rowData?.DoctorImage
                    : "/images/placeholderImage.png"
                }
                sx={{ width: 70, height: 70 }}
              />
              <Box mx={2}>
                <MuiTypography
                  variant="body1"
                  component="h6"
                  color="#000"
                  fontWeight="500"
                >
                  {rowData?.doctor || "N/A"}
                </MuiTypography>
                <MuiTypography variant="body2" component="p" color="#333">
                  {rowData?.doctorEmail || "N/A"}
                </MuiTypography>
              </Box>
            </Box>
          </Box>

          <Box gridColumn="span 12">
            <MuiTypography variant="body2" component="h6" color="#999">
              Email
            </MuiTypography>

            <MuiTypography variant="body1" component="p" color="#333">
              {rowData?.doctorEmail || "N/A"}
            </MuiTypography>
          </Box>
          <Box gridColumn="span 6">
            <MuiTypography variant="body2" component="h6" color="#999">
              Phone Number
            </MuiTypography>

            <MuiTypography variant="body1" component="p" color="#333">
              {rowData?.doctorPhoneNo || "N/A"}
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
        </Box>
      </Box>
    </Box>
  );
}
