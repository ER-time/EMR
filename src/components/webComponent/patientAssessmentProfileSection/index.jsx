import * as React from "react";
import { Accordian, Box } from "@/components";
import MuiTypography from "@/components/core/Typography";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Prescription from "./prescription/prescription.jsx.jsx";
import SOAPNotes from "./soapNotes";
import HOPI from "./hopi";

export default function PatientAssessment({appointmentData,hideActions,rowData}) {
  const [expanded, setExpanded] = React.useState("panel1");
  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  let patientAssessmentData = [
    // {
    //   name: "insurance",
    //   title: "Insurance",
    //   summaryComponent: <Insurance />,
    // },
    {
      name: "soap notes",
      title: "SOAP Notes", 
      summaryComponent: <SOAPNotes hideActions={hideActions} rowData={rowData}/>,
    },
    {
      name: "prescription",
      title: "Prescription",
      summaryComponent: <Prescription hideActions={hideActions} rowData={rowData}/>,
    },
    {
      name: "hopi",
      title: "HOPI",
      summaryComponent: <HOPI appointmentData={appointmentData || []} hideActions={hideActions}  rowData={rowData}/>,
    },
    // {
    //   name: "consultation",
    //   title: "Consultation",
    //   summaryComponent: <Consultation />,
    // },
  ];

  return (
    <Box sx={{ p: "10px" }}>
      {patientAssessmentData.map((item, index) => (
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
