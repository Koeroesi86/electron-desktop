import React from "react";
import { RevivableComponent } from "@app-types";
import { ReviverLayout } from "@koeroesi86/react-reviver";
import useWorkspace from "@hooks/useWorkspace";
import FixedWrapper from "../fixed-wrapper";

export interface WorkspaceProps {}

const Workspace: React.FC<WorkspaceProps> = () => {
  const [instances, setInstances] = useWorkspace();

  return (
    <FixedWrapper top={0} left={0} width={100} height={100}>
      <ReviverLayout
        data={instances.map(
          (instance, index): RevivableComponent => ({
            type: "widget-control",
            id: instance.id,
            props: {
              top: instance.top,
              left: instance.left,
              width: instance.width,
              height: instance.height,
              id: instance.id,
              onChange: (bounds) => {
                const currentInstances = instances.slice(0);
                currentInstances[index] = {
                  ...currentInstances[index],
                  ...bounds,
                };
                setInstances(currentInstances);
              },
            },
            children: [{ type: "widget", props: { alias: instance.alias, id: instance.id, devtools: false } }],
          })
        )}
      />
    </FixedWrapper>
  );
};

export default Workspace;
