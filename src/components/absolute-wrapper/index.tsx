import styled from "styled-components";
import React from "react";

export interface AbsoluteWrapperProps
  extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  top: number;
  left: number;
  width: number;
  height: number;
}

export const blockedProps = ["top", "left", "width", "height"];

const AbsoluteWrapper = styled.div.withConfig<AbsoluteWrapperProps>({
  shouldForwardProp: (p) => !blockedProps.includes(p),
})`
  position: absolute;
  top: ${(props) => `${props.top}%`};
  left: ${(props) => `${props.left}%`};
  width: ${(props) => `${props.width}%`};
  height: ${(props) => `${props.height}%`};
`;

export default AbsoluteWrapper;
