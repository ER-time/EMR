import * as React from "react";
import { useState } from "react";
import Accordion from "@mui/material/Accordion";
import Image from "next/image";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import styled from "styled-components";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

import { Box, Accordian } from "@/components";
import MuiTypography from "@/components/core/Typography";

const StyledInnerDiv = styled.div`
  margin-bottom: 20px;
`;

const StyledAccordion = styled(Accordion)`
  margin-bottom: 10px;
`;
export default function AccordionData({data}) {
  const [expanded, setExpanded] = React.useState("109");

  const handleChangeAcc = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  let patientAssessmentAcc = data?.data?.data.map((item, index) => {
    return {
      name: item.patient || "Dr. Cody Forman",
      speciality: "Cardiology",
      appointmentId:item.appointmentId || "",
      date: "Thu 29 Aug, 2023",
      image: (
        <Image
          key={index} // You may want to use a unique key here
          src={"/images/userImage1.png"}
          width={50}
          height={50}
          loading="lazy"
          style={{
            objectFit: "cover",
            paddingRight: "10px",
          }}
          alt="user-img"
        />
      ),
      title: "cardiology",
      data: [
        {
          id: 1,
          title: "Past Prescription",
          description:
            "Stacey reports that she is 'feeling good' and enjoying her time away. Stacey reports she has been compliant with her medication and using her meditation app whenever she feels heranxiety.",
        },
        {
          id: 2,
          title: "Present Prescription",
          description:
            "Stacey was unable to attend her session as she is on a family holiday this week. She was able to touch base with me over the phone and was willing and able to make the phone call at the set time. Stacey appeared to be calm and positive over the phone.",
        },
        {
          id: 3,
          title: "Assessment",
          description:
          item?.assessment|| "Stacey presented this afternoon with a relaxed mood. Her speech was normal in rate, tone, and volume. Stacey was able to articulate her thoughts and feelings coherently. Stacey did not present with any signs of hallucinations or delusions. Insight and judgment are good. No sign of substance use was present.",
        },
        {
          id: 4,
          title: "Plan",
          description:
           item?.plan || "Plan to meet again in person at 2 pm next Tuesday, 25th May. Stacey will continue on her current medication and has given her family copies of her safety plan should she need it.",
        },
      ],
    };
  });
  
  return (
    <>
      <StyledAccordion sx={{ boxShadow: "none" }}>
        <Box sx={{ p: "10px" }}>
          {(patientAssessmentAcc || []).map((item, index) =>{ 
            return(
            <Accordian
              key={index}
              sx={{
                marginBottom: 2,
                background: "#FFF",
                border: `${
                  expanded === item?.appointmentId ? "1px solid #E6E6E6" : "none"
                }`,
                boxShadow: "none",
                borderRadius: "2px",
                "&:before": {
                  backgroundColor: "transparent",
                },
              }}
              expanded={expanded === item?.appointmentId}
              onChange={handleChangeAcc(item?.appointmentId)}
            >
              <Accordian.AccordionSummary
                expandIcon={
                  expanded === item?.appointmentId ? (
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
                <Box display="flex">
                  {item?.image}
                  <Box display="flex" flexWrap="wrap">
                    <Box
                      width="auto"
                      sx={{ minWidth: "fit-content", marginRight: "2rem" }}
                    >
                      <MuiTypography
                        variant="body1"
                        component="h6"
                        fontWeight="600"
                        color="#333"
                      >
                        {item?.name}
                      </MuiTypography>
                      <MuiTypography
                        variant="p"
                        component="p"
                        fontWeight="400"
                        color="#333"
                      >
                        {item?.speciality}
                      </MuiTypography>
                    </Box>

                    <Box width="auto">
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
                        {item?.date}
                      </MuiTypography>
                    </Box>
                  </Box>
                </Box>
              </Accordian.AccordionSummary>
              <Accordian.AccordionDetails>
                {item?.data && typeof item.data === "string" ? (
                  <div>{item.data}</div>
                ) : (
                  item?.data.map((objectData, index) => (
                    <StyledInnerDiv key={index}>
                      <MuiTypography
                        variant="h6"
                        component="h6"
                        fontWeight="600"
                        fontSize="16px"
                        color="#348AF4"
                      >
                        {objectData?.title}
                      </MuiTypography>
                      <MuiTypography
                        variant="h6"
                        component="p"
                        fontWeight="400"
                        fontSize="14px"
                        color="#666666"
                      >
                        {objectData?.description}
                      </MuiTypography>
                      {objectData?.images && objectData.images.length > 0 && (
                        <div className="d-flex flex-wrap">
                          {objectData.images.map((image, imgIndex) => (
                            <div key={imgIndex}>{image}</div>
                          ))}
                        </div>
                      )}
                    </StyledInnerDiv>
                  ))
                )}
              </Accordian.AccordionDetails>
            </Accordian>
          )})}
        </Box>
      </StyledAccordion>
    </>
  );
}
