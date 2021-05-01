import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Listener, WidgetBounds, WorkspaceEdit } from "@app-types";
import { WORKSPACE_EDIT_CHANNEL } from "@constants";
import useValue from "@hooks/useValue";
import useChannel from "@hooks/useChannel";
import AbsoluteWrapper from "../absolute-wrapper";

export interface WidgetControlsProps {
  top: number;
  left: number;
  width: number;
  height: number;
  id: string;
  onChange: (bounds: WidgetBounds) => void | Promise<void>;
  children?: React.ReactNode;
}

const Wrapper = styled(AbsoluteWrapper)`
  &[draggable="true"]::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
  }
`;

const WidgetControls: React.FC<WidgetControlsProps> = ({ id, top, left, width, height, children, onChange }) => {
  const workspaceEditChannel = useChannel<WorkspaceEdit>(WORKSPACE_EDIT_CHANNEL);
  const [bounds, setBounds] = useState<WidgetBounds>({ id, top, left, width, height });
  const [dragOffset, setDragOffset] = useValue<{ x: number; y: number }>({ x: 0, y: 0 });
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const workspaceEditListener: Listener<WorkspaceEdit> = (_, { isEdit }) => setEditing(isEdit);

    workspaceEditChannel.subscribe(workspaceEditListener);
    return () => {
      workspaceEditChannel.unsubscribe(workspaceEditListener);
    };
  }, []);

  return (
    <Wrapper
      top={bounds.top}
      left={bounds.left}
      width={bounds.width}
      height={bounds.height}
      draggable={editing}
      onMouseUp={(e) => {
        if (e.button === 2) {
          console.log("right click");
        }
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
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  children: PropTypes.node,
};

WidgetControls.defaultProps = {
  children: null,
  onChange: () => {},
};

export default WidgetControls;
