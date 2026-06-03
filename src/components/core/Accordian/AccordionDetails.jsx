import styled from "styled-components";
import AccordionDetails from "@mui/material/AccordionDetails";

const StyledAccordionDetail = styled(AccordionDetails)``;

export default function AccordionDetailCompo({ children, ...rest }) {
  return <StyledAccordionDetail {...rest}>{children}</StyledAccordionDetail>;
}
