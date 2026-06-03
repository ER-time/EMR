import styled from "styled-components";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";

import MuiTypography from "@/components/core/Typography";
import { Box } from "@/components";
import { FiFileText } from "react-icons/fi";
import { MdKeyboardArrowRight } from "react-icons/md";
import {  useGetAllSoapNotesQuery } from "@/redux/slices/userProfile";
import { useSession } from "next-auth/react";
import AppointmenChart from "../../../admin/parts/appointmentChart";

const StyledSection = styled.div`
  width: 100%;
`;
const StyledInnerDiv = styled.div`
  margin-bottom: 20px;
`;
const SoapData = [
  {
    id: 1,
    title: "Subjective",
    description:
      "Stacey reports that she is 'feeling good' and enjoying her time away. Stacey reports she has been compliant with her medication and using her meditation app whenever she feels heranxiety.",
  },
  {
    id: 2,
    title: "Objective",
    description:
      "Stacey was unable to attend her session as she is on a family holiday this week. She was able to touch base with me over the phone and was willing and able to make the phone call at the set time. Stacey appeared to be calm and positive over the phone.",
  },
  {
    id: 3,
    title: "Assessment",
    description:
      "Stacey presented this afternoon with a relaxed mood. Her speech was normal in rate, tone, and volume. Stacey was able to articulate her thoughts and feelings coherently. Stacey did not present with any signs of hallucinations or delusions. Insight and judgment are good. No sign of substance use was present.",
  },
  {
    id: 4,
    title: "Plan",
    description:
      "Plan to meet again in person at 2 pm next Tuesday, 25th May. Stacey will continue on her current medication and has given her family copies of her safety plan should she need it.",
  },
];

export default function PatientAssessment() {
  const session = useSession()
  const getAllSoapNotes = useGetAllSoapNotesQuery({appointmentId:1});
  return (
    <StyledSection>
      <Box sx={{ p: "10px" }}>
        {/* <Accordion>
          <AccordionSummary
            expandIcon={<AddIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <MuiTypography fontWeight={600}>Insurance</MuiTypography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ padding: "10px" }}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                sx={{
                  background: "#E7F1FE",
                  padding: "10px",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                <Box display="flex" alignItems="center">
                  <FiFileText
                    size={28}
                    color="#fff"
                    style={{
                      background: "#348af4",
                      padding: "10px",
                      borderRadius: "5px",
                    }}
                  />
                  <MuiTypography variant="p" marginLeft="10px" color="#000000">
                    INN - 434341255
                  </MuiTypography>
                </Box>
                <MdKeyboardArrowRight size={28} />
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion> */}
        <Accordion>
          <AccordionSummary
            expandIcon={<AddIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <MuiTypography fontWeight={600}>SOAP Notes</MuiTypography>
          </AccordionSummary>
          <AccordionDetails>
            {getAllSoapNotes?.data?.data?.map((item, index) => (
              <StyledInnerDiv key={index}>
                <MuiTypography
                  variant="h6"
                  component="h6"
                  fontWeight="600"
                  fontSize="16px"
                  color="#348AF4"
                >
                  {item?.subjective}
                </MuiTypography>
                <MuiTypography
                  variant="h6"
                  component="p"
                  fontWeight="400"
                  fontSize="14px"
                  color="#666666"
                >
                  {item?.objective}
                </MuiTypography>
              </StyledInnerDiv>
            ))}
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<AddIcon />}
            aria-controls="panel3a-content"
            id="panel3a-header"
          >
            <MuiTypography fontWeight={600}>Prescription</MuiTypography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
              eget.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>
    </StyledSection>
  );
}
