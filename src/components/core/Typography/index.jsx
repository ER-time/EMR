import styled from "styled-components";
import Typography from "@mui/material/Typography";

const TypographyText = styled(Typography)``;

export default function MuiTypography({ children, ...rest }) {
  return <TypographyText {...rest}>{children}</TypographyText>;
}
