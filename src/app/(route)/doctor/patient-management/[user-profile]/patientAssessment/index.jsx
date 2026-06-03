import * as React from "react";
import { Accordian, Box } from "@/components";
import MuiTypography from "@/components/core/Typography";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import EditIcon from "@mui/icons-material/Edit";
import Insurance from "./insurance";
import Prescription from "./prescription";
import SoapNotes from "./soapNotes";
import HOPI from "./hopi";
import Consultation from "./consultation";

export default function PatientAssessment() {
  const [expanded, setExpanded] = React.useState("panel1");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  let patientAccessment = [
    // {
    //   name: "insurance",
    //   title: "Insurance",
    //   summaryComponent: <Insurance />,
    // },
    {
      name: "Soap Notes",
      title: "SOAP Notes",
      summaryComponent: <SoapNotes />,
    },
    {
      name: "Prescription",
      title: "Prescription",
      summaryComponent: <Prescription />,
    },
    {
      name: "hopi",
      title: "HOPI",
      summaryComponent: <HOPI />,
    },
    // {
    //   name: "consultation",
    //   title: "Consultation",
    //   summaryComponent: <Consultation />,
    // },
  ];

  return (
    <Box sx={{ p: "10px" }}>
      {patientAccessment.map((item, index) => (
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
                <AddIcon sx={{ color: "#000000" }} />
              ) : (
                <RemoveIcon sx={{ color: "#000000" }} />
              )
            }
            aria-controls="panel1a-content"
            id="panel1a-header"
            sx={{
              background: "#F9FAFC",
              borderRadius: "2px 2px 0px 0px",
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <MuiTypography
                variant="body1"
                component="h6"
                fontWeight="600"
                color="#333"
              >
                {item?.title}
              </MuiTypography>

              {/* <Box
                display="flex"
                alignItems="center"
                width="fit-content"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("runing");
                }}
                sx={{ cursor: "pointer", mx: 1 }}
              >
                <EditIcon sx={{ color: "#666", fontSize: 13 }} />{" "}
                <span style={{ color: "#666" }}>Edit</span>
              </Box> */}
            </Box>
          </Accordian.AccordionSummary>
          <Accordian.AccordionDetails>
            {item?.summaryComponent}
          </Accordian.AccordionDetails>
        </Accordian>
      ))}
    </Box>
  );
}
