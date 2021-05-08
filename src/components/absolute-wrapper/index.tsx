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

const AbsoluteWrapper = styled.div
  .attrs<AbsoluteWrapperProps>((props) => ({
    style: {
      top: `${props.top}%`,
      left: `${props.left}%`,
      width: `${props.width}%`,
      height: `${props.height}%`,
    },
  }))
  .withConfig<AbsoluteWrapperProps>({
    shouldForwardProp: (p) => !blockedProps.includes(p),
  })`
  position: absolute;
`;

export default AbsoluteWrapper;
