import React, { useState } from "react";
import useWorkspace from "@hooks/useWorkspace";
import useIsEditing from "@hooks/useIsEditing";
import WidgetContextMenu from "@components/widget-context-menu";
import FixedWrapper from "@components/fixed-wrapper";
import WidgetControls from "@components/widget-controls";
import Widget from "@components/widget";
import { useScriptRegistry } from "@components/script-registry";

export interface WorkspaceProps {}

const Workspace: React.FC<WorkspaceProps> = () => {
  const scriptRegistry = useScriptRegistry();
  const [instances, setInstances] = useWorkspace();
  const [editing] = useIsEditing();
  const [widgetContextMenu, setWidgetContextmenu] = useState({ show: false, x: 0, y: 0, id: "" });

  return (
    <FixedWrapper top={0} left={0} width={100} height={100}>
      {Object.keys(instances).map((id) => (
        <WidgetControls
          key={`widget-control-${id}`}
          left={instances[id].left}
          width={instances[id].width}
          top={instances[id].top}
          height={instances[id].height}
          editing={editing}
          onChange={(bounds) => {
            setInstances({
              ...instances,
              [id]: {
                ...instances[id],
                ...bounds,
              },
            });
          }}
          onContextMenu={(x, y) => {
            setWidgetContextmenu({ show: true, x, y, id });
          }}
        >
          <Widget partition={`persist:widget-${id}}`} uri={scriptRegistry.get(instances[id].alias).uri} />
        </WidgetControls>
      ))}
      {widgetContextMenu.show && (
        <WidgetContextMenu
          x={widgetContextMenu.x}
          y={widgetContextMenu.y}
          onBlur={() => setWidgetContextmenu({ ...widgetContextMenu, show: false })}
        />
      )}
    </FixedWrapper>
  );
};

export default Workspace;
