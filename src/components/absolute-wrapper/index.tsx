import styled from "styled-components";

export interface WrapperProps {
  top: number;
  left: number;
  width: number;
  height: number;
}

const blockedProps = ["top", "left", "width", "height"];

const AbsoluteWrapper = styled.div.withConfig<WrapperProps>({ shouldForwardProp: (p) => !blockedProps.includes(p) })`
  position: absolute;
  top: ${(props) => `${props.top}%`};
  left: ${(props) => `${props.left}%`};
  width: ${(props) => `${props.width}%`};
  height: ${(props) => `${props.height}%`};
`;

export default AbsoluteWrapper;
