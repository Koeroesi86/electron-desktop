import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

export interface WidgetContextMenuProps {
  x: number;
  y: number;
  onBlur: () => void | Promise<void>;
}

const Wrapper = styled.div<{ x: number; y: number }>`
  position: fixed;
  top: ${(props) => `${props.y}%`};
  left: ${(props) => `${props.x}%`};
  outline: 0;
`;

const WidgetContextMenu: React.FC<WidgetContextMenuProps> = ({ x, y, onBlur }) => {
  const element = useRef();

  useEffect(() => {
    if (element.current) {
      // @ts-ignore
      element.current.focus();
    }
  }, []);

  return (
    <Wrapper y={y} x={x} tabIndex={0} ref={element} onBlur={onBlur}>
      <div>Context</div>
    </Wrapper>
  );
};

WidgetContextMenu.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  onBlur: PropTypes.func.isRequired,
};

export default WidgetContextMenu;
