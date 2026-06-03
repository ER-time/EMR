import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const Wrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 18px;
  height: 18px;
  background-color: #000;
  border: 2px solid #fff;
  border-radius: 100%;
  user-select: none;
  transform: translate(-50%, -50%);
  cursor: ${(props) => (props.onClick ? "pointer" : "default")};
  &:hover {
    z-index: 1;
  }
`;

const Marker = ({ text, onClick }) => (
  <div style={{ position: "relative", transform: "translate(-50%, -100%)" }}>
    <img
      src="http://icons.iconarchive.com/icons/paomedia/small-n-flat/256/map-marker-icon.png"
      alt={text}
      style={{ height: "30px", width: "30px" }} // Adjust size as needed
    />
  </div>
);

Marker.defaultProps = {
  onClick: null,
};

Marker.propTypes = {
  onClick: PropTypes.func,
  text: PropTypes.string.isRequired,
};

export default Marker;
