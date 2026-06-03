import styled from "styled-components";
import Accordion from "@mui/material/Accordion";
import AccordionSummaryCompo from "./AccordionSummary";
import AccordionDetailCompo from "./AccordionDetails";

const StyledAccordian = styled(Accordion)``;

export default function AccordianCompo({
  sx,
  expanded,
  onChange,
  children,
  ...rest
}) {
  return (
    <StyledAccordian expanded={expanded} onChange={onChange} sx={sx} {...rest}>
      {children}
    </StyledAccordian>
  );
}

AccordianCompo.defaultProps = {};

AccordianCompo.AccordionSummary = AccordionSummaryCompo;
AccordianCompo.AccordionDetails = AccordionDetailCompo;
