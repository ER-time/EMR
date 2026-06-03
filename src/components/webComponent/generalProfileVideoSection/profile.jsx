import { Box, ListItemButton } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

const PatientProfileVideoSection = ({ appointmentData }) => {
  const renderListItem = (label, value) => {
    // Check if value is null or undefined, then display "N/A"
    const displayValue = value != null ? value : "N/A";

    return (
      <ListItem disablePadding>
        <ListItemButton>
          <ListItemText primary={`${label}: ${displayValue}`} />
        </ListItemButton>
      </ListItem>
    );
  };

  if (!appointmentData) {
    return null;
  }

  return (
    <Box>
      <List
        sx={{
          width: "100%",
          maxWidth: 360,
          bgcolor: "background.paper",
          fontWeight: "bold !important",
        }}
      >
        {renderListItem("Name", appointmentData.data?.patient)}
        {renderListItem("Phone Number", appointmentData.data?.patientPhoneNo)}
        {renderListItem("Email", appointmentData.data?.patientEmail)}
        {renderListItem("Address", appointmentData.data?.patientAddress)}
      </List>
    </Box>
  );
};

export default PatientProfileVideoSection;
