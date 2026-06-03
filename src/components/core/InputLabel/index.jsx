import { InputLabel } from "@mui/material";

export default function FieldLabel({ children, ...props }) {
  return <InputLabel {...props}>{children}</InputLabel>;
}

FieldLabel.propTypes = {};

FieldLabel.defaultProps = {};
