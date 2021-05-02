import React from "react";
import { RevivableComponent } from "@app-types";
import { ReviverLayout } from "@koeroesi86/react-reviver";
import useWorkspace from "@hooks/useWorkspace";

export interface WorkspaceProps {}

const Workspace: React.FC<WorkspaceProps> = () => {
  const [instances, setInstances] = useWorkspace();

  return (
    <ReviverLayout
      data={{
        type: "fixed-wrapper",
        props: { top: 0, left: 0, width: 100, height: 100 },
        children: [
          ...instances.map(
            (instance, index): RevivableComponent => ({
              type: "widget-control",
              id: `widget-control-${instance.id}`,
              props: {
                top: instance.top,
                left: instance.left,
                width: instance.width,
                height: instance.height,
                onChange: (bounds) => {
                  const currentInstances = instances.slice(0);
                  currentInstances[index] = {
                    ...currentInstances[index],
                    ...bounds,
                  };
                  setInstances(currentInstances);
                },
                onContextMenu: (x, y) => {
                  console.log("onContextMenu", x, y);
                },
              },
              children: [
                {
                  type: "widget",
                  id: `widget-${instance.id}`,
                  props: { devtools: false, uri: window.scriptRegistry.get(instance.alias).uri, partition: `persist:widget-${instance.id}}` },
                },
              ],
            })
          ),
        ],
      }}
    />
  );
};

export default Workspace;
