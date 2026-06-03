import styled from "styled-components";
import PropTypes from "prop-types";

const ContainerWithBackground = styled.div`
  background-image: url(${(props) => props.src});
  min-height: ${(props) => props.minHeight};
  background-repeat: no-repeat;
  background-size: ${(props) => props.backgroundSize};
  background-position: ${(props) => props.position};
`;

export default function BgImageContainer({ children, ...props }) {
  return (
    <ContainerWithBackground {...props}>{children}</ContainerWithBackground>
  );
}

BgImageContainer.propTypes = {
  backgroundSize: PropTypes.string,
  children: PropTypes.node,
};

BgImageContainer.defaultProps = {
  backgroundSize: "cover",
  children: null,
};
