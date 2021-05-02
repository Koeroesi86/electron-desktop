import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import useValue from "@hooks/useValue";
import AbsoluteWrapper from "../absolute-wrapper";

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
  editing: boolean;
  onChange: (bounds: Bounds) => void | Promise<void>;
  onContextMenu: (x: number, y: number) => void | Promise<void>;
  children?: React.ReactNode;
}

const Wrapper = styled(AbsoluteWrapper)`
  &[draggable="true"] {
    webview {
      pointer-events: none;
    }
  }
`;

const WidgetControls: React.FC<WidgetControlsProps> = ({ top, left, width, height, children, editing, onChange, onContextMenu }) => {
  const [bounds, setBounds] = useState<Bounds>({ top, left, width, height });
  const [dragOffset, setDragOffset] = useValue<{ x: number; y: number }>({ x: 0, y: 0 });

  return (
    <Wrapper
      top={bounds.top}
      left={bounds.left}
      width={bounds.width}
      height={bounds.height}
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
        setBounds({ ...bounds, left: relXDiff, top: relYDiff });
        onChange({ ...bounds, left: relXDiff, top: relYDiff });
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
  editing: PropTypes.bool,
  onChange: PropTypes.func,
  onContextMenu: PropTypes.func,
  children: PropTypes.node,
};

WidgetControls.defaultProps = {
  children: null,
  editing: false,
  onChange: () => {},
  onContextMenu: () => {},
};

export default WidgetControls;
