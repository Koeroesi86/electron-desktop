import React, { useState } from "react";
import useWorkspace from "@hooks/useWorkspace";
import useIsEditing from "@hooks/useIsEditing";
import ContextMenu from "@components/context-menu";
import FixedWrapper from "@components/fixed-wrapper";
import WidgetControls from "@components/widget-controls";
import Widget from "@components/widget";
import { useScriptRegistry } from "@components/script-registry";
import ContextMenuItem from "@components/context-menu-item";

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
          zIndex={instances[id].zIndex}
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
        <ContextMenu
          x={widgetContextMenu.x}
          y={widgetContextMenu.y}
          onHide={() => setWidgetContextmenu({ ...widgetContextMenu, show: false })}
        >
          <ContextMenuItem
            onClick={() => {
              const instance = instances[widgetContextMenu.id];
              setInstances({
                ...instances,
                [widgetContextMenu.id]: {
                  ...instance,
                  zIndex: instance.zIndex + 1,
                },
              });

              setWidgetContextmenu({ ...widgetContextMenu, show: false });
            }}
          >
            Bring forward
          </ContextMenuItem>
          <ContextMenuItem
            onClick={() => {
              const instance = instances[widgetContextMenu.id];

              if (instance.zIndex > 0) {
                setInstances({
                  ...instances,
                  [widgetContextMenu.id]: {
                    ...instance,
                    zIndex: instance.zIndex - 1,
                  },
                });
              }

              setWidgetContextmenu({ ...widgetContextMenu, show: false });
            }}
          >
            Bring backward
          </ContextMenuItem>
        </ContextMenu>
      )}
    </FixedWrapper>
  );
};

export default Workspace;
