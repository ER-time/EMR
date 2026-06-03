import styled from "styled-components";
import MuiTypography from "../Typography";

const BadgeWithDot = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  .dot {
    margin: 0px 10px;
    width: 8px;
    height: 8px;
    border-radius: 100%;
    background: ${(props) => props.dotcolor};
  }
`;

export default function DotStatusBadge({ tittle, dotcolor, ...rest }) {
  return (
    <BadgeWithDot dotcolor={dotcolor} {...rest}>
      <div className="dot"></div>
      <MuiTypography variant="body1" component="span" fontWeight="normal">
        {tittle}
      </MuiTypography>
    </BadgeWithDot>
  );
}
