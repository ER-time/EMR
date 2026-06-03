import styled from "styled-components";
import MuiPhoneNumber from "material-ui-phone-number";

const StyledMuiPhoneNumber = styled(MuiPhoneNumber)`
  height: ${(props) => props.height} !important;
  display: ${(props) => props.display} !important;

  .MuiInputBase-root:hover:before {
    border-color: rgba(0, 0, 0, 0.87) !important;
  }

  .MuiInputBase-root:before {
    border: ${(props) => props.border}!important;
    height: 100%;
    border-radius: ${(props) => props.radius}!important;
  }
  .MuiInputBase-root:after {
    border: none;
  }
  .MuiInputBase-root {
    width: ${(props) => props.width};
    height: 100%;
    padding: 10px;
  }
  .MuiOutlinedInput-notchedOutline {
    border: ${(props) => props.border}!important;

    border-radius: ${(props) => props.radius}!important;
  }
  input {
    font-size: ${(props) => props.fsize};
  }
  .dropdown-container-style > ul {
    height: 300px !important;
    minheight: 300px !important;
    maxheight: 300px !important;
  }
`;

export default function PhoneInputCompo({
  height,
  width,
  border,
  radius,
  fsize,
  display,
  ...props
}) {
  return (
    <StyledMuiPhoneNumber
      height={height}
      width={width}
      border={border}
      radius={radius}
      fsize={fsize}
      display={display}
      defaultCountry="gb"
      dropdownClass="dropdown-container-style"
      // regions={"europe"}
      {...props}
    />
  );
}

PhoneInputCompo.propTypes = {};

PhoneInputCompo.defaultProps = {
  height: "50px",
  width: "100%",
  border: "1px solid #D9D9D9",
  radius: "5px",
  fsize: "16px",
  display: "block",
};
