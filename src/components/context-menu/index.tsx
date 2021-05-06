import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import useWindowEvent from "@hooks/useWindowEvent";

export interface ContextMenuProps {
  x: number;
  y: number;
  onHide: () => void | Promise<void>;
  children: React.ReactNode;
}

const Wrapper = styled.div<{ x: number; y: number; show: boolean }>`
  position: fixed;
  top: ${(props) => `${props.y}%`};
  left: ${(props) => `${props.x}%`};
  opacity: ${({ show }) => (show ? 1 : 0)};
  z-index: 999999;
  transition: opacity 0.2s ease-in-out;
`;

const Content = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background: #ffffff;
`;

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, onHide, children }) => {
  const element = useRef<HTMLDivElement>();
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useWindowEvent("mousedown", (e) => {
    const node = element.current;
    // @ts-ignore
    if (node && !node.isSameNode(e.target) && !node.contains(e.target)) {
      onHide();
    }
  });

  useEffect(() => {
    const node = element.current;
    if (node) {
      const relWidth = (node.clientWidth / window.innerWidth) * 100;
      const relHeight = (node.clientHeight / window.innerHeight) * 100;
      setPosition({
        top: relHeight + y > 100 ? y - relHeight : y,
        left: relWidth + x > 100 ? x - relWidth : x,
      });
      setIsVisible(true);
    }
    return () => {
      setIsVisible(false);
    };
  }, [x, y, children]);

  return (
    <Wrapper y={position.top} x={position.left} ref={element} show={isVisible}>
      <Content>{children}</Content>
    </Wrapper>
  );
};

ContextMenu.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  onHide: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default ContextMenu;
