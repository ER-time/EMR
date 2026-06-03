import styled from "styled-components";
import AccordionSummary from "@mui/material/AccordionSummary";

const StyledAccordionSummary = styled(AccordionSummary)``;

export default function AccordionSummaryCompo({ children, ...rest }) {
  return <StyledAccordionSummary {...rest}>{children}</StyledAccordionSummary>;
}
