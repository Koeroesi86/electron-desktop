import styled from "styled-components";

interface Props {
  top?: number;
  left?: number;
  width?: number;
  height?: number;
}

const blockedProps = ['top', 'left', 'width', 'height'];

const FixedWrapper = styled.div.withConfig<Props>({ shouldForwardProp: (p) => !blockedProps.includes(p) })`
  position: fixed;
  top: ${(props) => `${props.top}%`};
  left: ${(props) => `${props.left}%`};
  width: ${(props) => `${props.width}%`};
  height: ${(props) => `${props.height}%`};
`;

FixedWrapper.defaultProps = {
  top: 0,
  left: 0,
  width: 100,
  height: 100,
};

export default FixedWrapper;
