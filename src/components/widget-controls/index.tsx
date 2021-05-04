import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import useValue from "@hooks/useValue";
import AbsoluteWrapper, { AbsoluteWrapperProps, blockedProps } from "../absolute-wrapper";

export interface Bounds {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface WidgetControlsProps {
  top: number;
  left: number;
  width: number;
  height: number;
  zIndex: number;
  editing: boolean;
  onChange: (bounds: Bounds) => void | Promise<void>;
  onContextMenu: (x: number, y: number) => void | Promise<void>;
  children?: React.ReactNode;
}

interface WrapperProps extends AbsoluteWrapperProps {
  zIndex: number;
}

const Wrapper = styled<React.FC<WrapperProps>>(AbsoluteWrapper).withConfig({
  shouldForwardProp: (p) => ![...blockedProps, "zIndex"].includes(p),
})`
  z-index: ${({ zIndex }) => zIndex};

  &[draggable="true"] {
    webview {
      pointer-events: none;
    }
  }
`;

const WidgetControls: React.FC<WidgetControlsProps> = ({
  top,
  left,
  width,
  height,
  children,
  editing,
  onChange,
  onContextMenu,
  zIndex,
}) => {
  const [dragOffset, setDragOffset] = useValue<{ x: number; y: number }>({ x: 0, y: 0 });

  return (
    <Wrapper
      top={top}
      left={left}
      width={width}
      height={height}
      zIndex={zIndex}
      draggable={editing}
      onContextMenu={(e) => {
        onContextMenu((e.pageX / window.innerWidth) * 100, (e.pageY / window.innerHeight) * 100);
      }}
      onDragStart={(e) => {
        setDragOffset({
          // @ts-ignore
          x: e.clientX - e.target.offsetLeft,
          // @ts-ignore
          y: e.clientY - e.target.offsetTop,
        });
      }}
      onDragEnd={(e) => {
        const { target, clientX, clientY } = e;
        // @ts-ignore
        const relXDiff = ((clientX - dragOffset.x) / target.parentNode.clientWidth) * 100;
        // @ts-ignore
        const relYDiff = ((clientY - dragOffset.y) / target.parentNode.clientHeight) * 100;
        onChange({ width, height, left: relXDiff, top: relYDiff });
      }}
    >
      {children}
    </Wrapper>
  );
};

WidgetControls.propTypes = {
  top: PropTypes.number.isRequired,
  left: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  zIndex: PropTypes.number,
  editing: PropTypes.bool,
  onChange: PropTypes.func,
  onContextMenu: PropTypes.func,
  children: PropTypes.node,
};

WidgetControls.defaultProps = {
  children: null,
  editing: false,
  zIndex: 0,
  onChange: () => {},
  onContextMenu: () => {},
};

export default WidgetControls;
