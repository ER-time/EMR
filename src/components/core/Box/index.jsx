import styled from "styled-components";
import PropTypes from "prop-types";
import MuiBox from "@mui/material/Box";

const BoxContainer = styled(MuiBox)`
  /* background: ${(props) => props.background}; */
  /* box-shadow: ${(props) => props.shadow}; */
  /* border-radius: ${(props) => props.radius}; */
  /* width: ${(props) => props.width}; */
  /* max-width: ${(props) => props.maxWidth}; */
  /* height: ${(props) => props.height}; */
   border: ${(props) => props.border}; 
  border-width: ${(props) => props.borderWidth};
  border-color: ${(props) => props.borderColor};
  border-style: ${(props) => props.borderStyle};
  /* border-radius: ${(props) => props.borderradius}; */
  /* min-height: ${(props) => props.minHeight}; */
  /* max-height: ${(props) => props.maxHeight}; */
  /* && {
    :hover {
      background: ${(props) => props.hoverBgColor};
      color: ${(props) =>
    props?.hoverTextColor ? props.hoverTextColor : "inherit"};
    }
  } */
`;

export default function Box({ children, ...props }) {
  return <BoxContainer {...props}>{children}</BoxContainer>;
}

Box.propTypes = {
  width: PropTypes.string,
  background: PropTypes.string,
  radius: PropTypes.string,
  shadow: PropTypes.string,
  children: PropTypes.node,
};

Box.defaultProps = {
  width: "100%",
  background: "transparent",
  radius: "0px",
  shadow: "none",
  children: null,
  boxSizing: "border-box",
};
