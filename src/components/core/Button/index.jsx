import styled from "styled-components";
import { Button } from "@mui/material";

const StyledButton = styled(Button)``;

export default function ButtonComponent({ children, ...props }) {
  return (
    <StyledButton
      {...props}
      style={{
        color: props.color,
        textTransform: "capitalize",
        width: props.width,
        background: props.bg,
        height: props.height,
        borderRadius: props.radius,
      }}
    >
      {children}
    </StyledButton>
  );
}

ButtonComponent.propTypes = {};

ButtonComponent.defaultProps = {
  variant: "contained",
};
