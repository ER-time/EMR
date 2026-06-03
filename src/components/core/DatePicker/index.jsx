import styled from "styled-components";
import { Button } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";

const StyledDatePicker = styled(DatePicker)`
  height: ${(props) => props.height} !important;
  display: ${(props) => props.display} !important;
  .MuiInputBase-root {
    /* width: 160px; */
    width: ${(props) => props.width};
    height: 100%;
  }
  .MuiOutlinedInput-notchedOutline {
    border: ${(props) => props.border}!important;
    /* border: 1px solid #e5e6e6 !important; */
    /* border-radius: 6px; */
    border-radius: ${(props) => props.radius}!important;
  }
  input {
    font-size: ${(props) => props.fsize};
  }
`;

export default function DatePickerCompo({
  height,
  width,
  border,
  radius,
  fsize,
  ...props
}) {
  return (
    <StyledDatePicker
      height={height}
      width={width}
      border={border}
      radius={radius}
      fsize={fsize}
      {...props}
    />
  );
}

DatePickerCompo.propTypes = {};

DatePickerCompo.defaultProps = {
  height: "50px",
  width: "100%",
  border: "1px solid #D9D9D9",
  radius: "5px",
  fsize: "16px",
  display: "block",
};
