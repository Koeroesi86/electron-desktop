import React, {useRef} from "react";
import WidgetWrapper from "../widgetWrapper";
import styled from "styled-components";

const Wrapper = styled(WidgetWrapper)`
  user-select: none;
`;

interface ChangeEvent {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface WidgetControlsProps {
  top: number;
  left: number;
  width: number;
  height: number;
  editing: boolean;
  onChange: (e: ChangeEvent) => void;
}

const WidgetControls: React.FC<WidgetControlsProps> = ({ onChange, children, editing, ...bounds }) => {
  const dragStartCoordinates = useRef({ x: 0, y: 0 });

  return (
    <Wrapper
      {...bounds}
      draggable={editing}
      onDragStart={(e) => {
        console.log('onDragStart:', e)
        dragStartCoordinates.current = {x: e.clientX, y: e.clientY};
      }}
      onDrag={(e) => {
        // console.log('onDrag:', e)
      }}
      onDragEnd={(e) => {
        const {target, clientX, clientY} = e;
        // @ts-ignore
        const xDiff = clientX - dragStartCoordinates.current.x;
        // @ts-ignore
        const yDiff = clientY - dragStartCoordinates.current.y;
        // @ts-ignore
        const relXDiff = (xDiff / target.parentNode.clientWidth) * 100;
        // @ts-ignore
        const relYDiff = (yDiff / target.parentNode.clientHeight) * 100;
        console.log('onDragEnd:', xDiff, yDiff) //e
        // onChange({
        //   ...bounds,
        //   // @ts-ignore
        //   left: (clientX / target.parentNode.clientWidth) * 100,
        //   // @ts-ignore
        //   top: (clientY / target.parentNode.clientHeight) * 100,
        // })
      }}
    >
      {children}
    </Wrapper>
  );
};

export default WidgetControls;
