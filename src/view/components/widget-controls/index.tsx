import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Listener, WidgetBounds, WorkspaceEdit } from "@app-types";
import { WIDGET_SAVE_BOUNDS_CHANNEL, WORKSPACE_EDIT_CHANNEL } from "../../../constants";
import AbsoluteWrapper from "../absolute-wrapper";
import Widget from "../widget";
import useIpc from "../../hooks/useIpc";

const Wrapper = styled(AbsoluteWrapper)`
  position: absolute;
`;

interface WidgetControlsProps {
  top: number;
  left: number;
  width: number;
  height: number;
  id: string;
  alias: string;
  initialState: string;
}

const WidgetControls: React.FC<WidgetControlsProps> = ({ alias, initialState, id, top, left, width, height }) => {
  const workspaceEditChannel = useIpc<WorkspaceEdit>(WORKSPACE_EDIT_CHANNEL);
  const widgetBoundsChannel = useIpc<WidgetBounds>(WIDGET_SAVE_BOUNDS_CHANNEL);
  const [bounds, setBounds] = useState<WidgetBounds>({ id, top, left, width, height });
  const dragOffset = useRef({ x: 0, y: 0 });
  const hasMounted = useRef(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (hasMounted.current) {
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
    hasMounted.current = true;
    return () => {
      hasMounted.current = false;
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
      onDragStart={(e) => {
        dragOffset.current = {
          // @ts-ignore
          x: e.clientX - e.target.offsetLeft,
          // @ts-ignore
          y: e.clientY - e.target.offsetTop,
        };
      }}
      onDragEnd={(e) => {
        const { target, clientX, clientY } = e;
        // @ts-ignore
        const relXDiff = ((clientX - dragOffset.current.x) / target.parentNode.clientWidth) * 100;
        // @ts-ignore
        const relYDiff = ((clientY - dragOffset.current.y) / target.parentNode.clientHeight) * 100;
        setBounds({ ...bounds, left: relXDiff, top: relYDiff });
      }}
    >
      <Widget alias={alias} id={id} initialState={initialState} />
    </Wrapper>
  );
};

WidgetControls.propTypes = {
  top: PropTypes.number.isRequired,
  left: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
  alias: PropTypes.string.isRequired,
  initialState: PropTypes.string,
};

WidgetControls.defaultProps = {
  initialState: "",
};

export default WidgetControls;
