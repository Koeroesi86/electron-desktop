import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Listener, WidgetBounds, WorkspaceEdit } from "@app-types";
import { WIDGET_SAVE_BOUNDS_CHANNEL, WORKSPACE_EDIT_CHANNEL } from "@constants";
import useIpc from "@hooks/useIpc";
import useValue from "@hooks/useValue";
import AbsoluteWrapper from "../absolute-wrapper";

export interface WidgetControlsProps {
  top: number;
  left: number;
  width: number;
  height: number;
  id: string;
  children?: React.ReactNode;
}

const WidgetControls: React.FC<WidgetControlsProps> = ({ id, top, left, width, height, children }) => {
  const workspaceEditChannel = useIpc<WorkspaceEdit>(WORKSPACE_EDIT_CHANNEL);
  const widgetBoundsChannel = useIpc<WidgetBounds>(WIDGET_SAVE_BOUNDS_CHANNEL);
  const [bounds, setBounds] = useState<WidgetBounds>({ id, top, left, width, height });
  const [dragOffset, setDragOffset] = useValue<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hasMounted, setHasMounted] = useValue<boolean>(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (hasMounted) {
      widgetBoundsChannel.dispatch({
        id,
        top: bounds.top,
        left: bounds.left,
        width: bounds.width,
        height: bounds.height,
      });
    }
  }, [bounds]);

  useEffect(() => {
    const workspaceEditListener: Listener<WorkspaceEdit> = (_, { isEdit }) => setEditing(isEdit);

    workspaceEditChannel.subscribe(workspaceEditListener);
    setHasMounted(true);
    return () => {
      setHasMounted(false);
      workspaceEditChannel.unsubscribe(workspaceEditListener);
    };
  }, []);

  return (
    <AbsoluteWrapper
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
      }}
    >
      {children}
    </AbsoluteWrapper>
  );
};

WidgetControls.propTypes = {
  top: PropTypes.number.isRequired,
  left: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
  children: PropTypes.node,
};

WidgetControls.defaultProps = {
  children: null,
};

export default WidgetControls;
