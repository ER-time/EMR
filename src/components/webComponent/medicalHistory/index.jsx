import * as React from "react";
import { Accordian, Box } from "@/components";
import MuiTypography from "@/components/core/Typography";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Allergies from "./allergies/allergies";
import SocialHistory from "./socialHistory/socialHistory";
import SurgicalHistory from "./surgicalHistory/surgicalHistory";
import FamilyHistory from "./familyHistory/familyHistory";
import PreExistingCondition from "./preExistingCondition/preExistingCondition";
import { useGetLookupByValueQuery } from "@/redux/slices/lookups";

export default function MedicalHistory({appointmentData}) {
  const [expanded, setExpanded] = React.useState("panel1");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  let medicalHistoy = [
    {
      name: "allergies",
      title: "Allergies",
      summaryComponent: <Allergies hideAction={true} appointmentData={appointmentData} />,
    },
    {
      name: "pre-existing condition",
      title: "Pre-Existing Condition",
      summaryComponent: <PreExistingCondition  hideAction={true}    appointmentData={appointmentData} />,
    },
    {
      name: "family history",
      title: "Family History",
      summaryComponent: <FamilyHistory hideAction={true}  appointmentData={appointmentData}  />,
    },
    {
      name: "social history",
      title: "Social History",
      summaryComponent: <SocialHistory hideAction={true} appointmentData={appointmentData} />,
    },
    {
      name: "surgical history",
      title: "Surgical History",
      summaryComponent: <SurgicalHistory hideAction={true} appointmentData={appointmentData}  />,
    },
  ];

  return (
    <Box sx={{ p: "10px" }}>
      {medicalHistoy.map((item, index) => (
        <Accordian
          key={index}
          sx={{
            marginBottom: 2,
            background: "#FFF",
            border: `${expanded === item?.name ? "1px solid #E6E6E6" : "none"}`,
            boxShadow: "none",
            borderRadius: "2px",
            "&:before": {
              backgroundColor: "transparent",
            },
          }}
          expanded={expanded === item?.name}
          onChange={handleChange(item?.name)}
        >
          <Accordian.AccordionSummary
            expandIcon={
              expanded === item?.name ? (
                <RemoveIcon sx={{ color: "#000000" }} />
              ) : (
                <AddIcon sx={{ color: "#000000" }} />
              )
            }
            aria-controls="panel1a-content"
            id="panel1a-header"
            sx={{
              background: "#F9FAFC",
              borderRadius: "2px 2px 0px 0px",
            }}
          >
            <MuiTypography
              variant="body1"
              component="h6"
              fontWeight="600"
              color="#333"
            >
              {item?.title}
            </MuiTypography>
          </Accordian.AccordionSummary>
          <Accordian.AccordionDetails>
            {item?.summaryComponent}
          </Accordian.AccordionDetails>
        </Accordian>
      ))}
    </Box>
  );
}
