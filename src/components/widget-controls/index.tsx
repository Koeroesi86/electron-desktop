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
  overflow: visible;
`;

const ControlsWrapper = styled(AbsoluteWrapper)`
  border: 1px dotted #333;
  z-index: 2;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`;

const VerticalResizeControl = styled(AbsoluteWrapper)`
  height: 4px !important;

  &,
  &:active {
    cursor: ns-resize;
  }
`;

const HorizontalResizeControl = styled(AbsoluteWrapper)`
  width: 4px !important;

  &,
  &:active {
    cursor: ew-resize;
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
    <Wrapper top={top} left={left} width={width} height={height} zIndex={zIndex}>
      {children}
      {editing && (
        <ControlsWrapper
          top={0}
          left={0}
          width={100}
          height={100}
          onContextMenu={(e) => {
            onContextMenu((e.pageX / window.innerWidth) * 100, (e.pageY / window.innerHeight) * 100);
          }}
          onDragStart={(e) => {
            setDragOffset({
              x: (e.pageX / window.innerWidth) * 100 - left,
              y: (e.pageY / window.innerHeight) * 100 - top,
            });
          }}
          onDrag={(e) => {
            const relXDiff = (e.pageX / window.innerWidth) * 100;
            const relYDiff = (e.pageY / window.innerHeight) * 100;

            if (relXDiff > 0 && relXDiff < 100 && relYDiff > 0 && relYDiff < 100) {
              onChange({ width, height, left: relXDiff - dragOffset.x, top: relYDiff - dragOffset.y });
            }
          }}
        >
          <VerticalResizeControl // top
            top={0}
            left={0}
            width={100}
            height={0}
            onDragStart={(e) => {
              e.stopPropagation();
            }}
            onDrag={(e) => {
              e.stopPropagation();
              const newTop = (e.pageY / window.innerHeight) * 100;
              const newHeight = height + (top - newTop);
              if (newHeight > 0 && newTop > 0) {
                onChange({ top: newTop, left, width, height: newHeight });
              }
            }}
          />
          <VerticalResizeControl // bottom
            top={100}
            left={0}
            width={100}
            height={0}
            onDragStart={(e) => {
              e.stopPropagation();
            }}
            onDrag={(e) => {
              e.stopPropagation();
              const newHeight = (e.pageY / window.innerHeight) * 100 - top;
              if (newHeight > 0) {
                onChange({ top, left, width, height: newHeight });
              }
            }}
          />
          <HorizontalResizeControl // left
            top={0}
            left={0}
            width={0}
            height={100}
            onDragStart={(e) => {
              e.stopPropagation();
            }}
            onDrag={(e) => {
              e.stopPropagation();
              const newLeft = (e.pageX / window.innerWidth) * 100;
              const newWidth = width + (left - newLeft);
              if (newWidth > 0 && newLeft > 0) {
                onChange({ top, left: newLeft, width: newWidth, height });
              }
            }}
          />
          <HorizontalResizeControl // right
            top={0}
            left={100}
            width={0}
            height={100}
            onDragStart={(e) => {
              e.stopPropagation();
            }}
            onDrag={(e) => {
              e.stopPropagation();
              const newWidth = (e.pageX / window.innerWidth) * 100 - left;
              if (newWidth > 0) {
                onChange({ top, left, width: newWidth, height });
              }
            }}
          />
        </ControlsWrapper>
      )}
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
