import * as React from "react";
import Accordion from "@mui/material/Accordion";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import styled from "styled-components";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { Box, Accordian } from "@/components";
import MuiTypography from "@/components/core/Typography";
import { useGetAllPrecriptionQuery } from "@/redux/slices/userProfile";
import { useParams } from "next/navigation";
import moment from "moment";

const StyledInnerDiv = styled.div`
  margin-bottom: 20px;
`;

const StyledAccordion = styled(Accordion)`
  margin-bottom: 10px;
`;
export default function Prescription({ rowData }) {
  const params = useParams();
  const getAllPrescription = useGetAllPrecriptionQuery({
    appointmentId: rowData?.appointmentId || 1,
  });
  const [expanded, setExpanded] = React.useState("cardiology");

  const handleChangeAcc = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <>
      <StyledAccordion sx={{ boxShadow: "none" }}>
        <Box sx={{ p: "10px" }}>
          {getAllPrescription?.data?.totalCounts === 0 ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                marginBottom: "20px",
              }}
            >
              No Record to show
            </div>
          ) : (
            getAllPrescription?.data?.data?.map((item, index) => {
              return (
                <Accordian
                  key={index}
                  sx={{
                    marginBottom: 2,
                    background: "#FFF",
                    border: `${
                      expanded === item?.patient ? "1px solid #E6E6E6" : "none"
                    }`,
                    boxShadow: "none",
                    borderRadius: "2px",
                    "&:before": {
                      backgroundColor: "transparent",
                    },
                  }}
                  expanded={expanded === item?.patient}
                  onChange={handleChangeAcc(item?.patient)}
                >
                  <Accordian.AccordionSummary
                    expandIcon={
                      expanded === item?.patient ? (
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
                    <Box sx={{ display: "flex" }}>
                      {item?.image}
                      <Box sx={{ width: "15%" }}>
                        <MuiTypography
                          variant="body1"
                          component="h6"
                          fontWeight="600"
                          color="#333"
                        >
                          {item?.patient || "Test"}
                        </MuiTypography>
                        <MuiTypography
                          variant="p"
                          component="p"
                          fontWeight="400"
                          color="#333"
                        >
                          {item?.speciality || "Test"}
                        </MuiTypography>
                      </Box>
                      <br />
                    </Box>
                  </Accordian.AccordionSummary>
                  <Accordian.AccordionDetails>
                    <StyledInnerDiv key={index}>
                      <MuiTypography
                        variant="h6"
                        component="h6"
                        fontWeight="600"
                        fontSize="16px"
                        color="#348AF4"
                      >
                        {item?.medicine}
                      </MuiTypography>
                      <MuiTypography
                        variant="h6"
                        component="p"
                        fontWeight="400"
                        fontSize="14px"
                        color="#666666"
                      >
                        {item?.medicine}
                      </MuiTypography>
                      <Box>
                        <MuiTypography
                          variant="p"
                          component="p"
                          fontWeight="400"
                          color="#333"
                          width="100%"
                          display="flex"
                          alignItems="center"
                        >
                          <FiberManualRecordIcon style={{ width: "10px" }} />{" "}
                          {moment(new Date(item.prescriptionStartTime)).format(
                            "YYYY-MM-DD"
                          )}
                        </MuiTypography>
                      </Box>
                    </StyledInnerDiv>
                  </Accordian.AccordionDetails>
                </Accordian>
              );
            })
          )}
        </Box>
      </StyledAccordion>
    </>
  );
}
