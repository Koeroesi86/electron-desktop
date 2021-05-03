import React, { useState } from "react";
import useWorkspace from "@hooks/useWorkspace";
import useIsEditing from "@hooks/useIsEditing";
import WidgetContextMenu from "@components/widget-context-menu";
import FixedWrapper from "@components/fixed-wrapper";
import WidgetControls from "@components/widget-controls";
import Widget from "@components/widget";
import { useScriptRegistry } from "@components/ScriptRegistry";

export interface WorkspaceProps {}

const Workspace: React.FC<WorkspaceProps> = () => {
  const scriptRegistry = useScriptRegistry();
  const [instances, setInstances] = useWorkspace();
  const [editing] = useIsEditing();
  const [widgetContextMenu, setWidgetContextmenu] = useState({ show: false, x: 0, y: 0, id: "" });

  return (
    <FixedWrapper top={0} left={0} width={100} height={100}>
      {instances.map((instance, index) => (
        <WidgetControls
          key={`widget-control-${instance.id}`}
          left={instance.left}
          width={instance.width}
          top={instance.top}
          height={instance.height}
          editing={editing}
          onChange={(bounds) => {
            const currentInstances = instances.slice(0);
            currentInstances[index] = {
              ...currentInstances[index],
              ...bounds,
            };
            setInstances(currentInstances);
          }}
          onContextMenu={(x, y) => {
            setWidgetContextmenu({ show: true, x, y, id: instance.id });
          }}
        >
          <Widget partition={`persist:widget-${instance.id}}`} uri={scriptRegistry.get(instance.alias).uri} />
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
