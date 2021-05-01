import React, { useEffect, useState } from "react";
import { Listener, RevivableComponent, WidgetInstance, WorkspaceState, WorkspaceStateSave } from "@app-types";
import { ReviverLayout } from "@koeroesi86/react-reviver";
import { WIDGET_SAVE_BOUNDS_CHANNEL, WORKSPACE_STATE_ACK_CHANNEL, WORKSPACE_STATE_CHANNEL } from "@constants";
import useValue from "@hooks/useValue";
import useChannel from "@hooks/useChannel";
import FixedWrapper from "../fixed-wrapper";

const wait = (delay: number = 1) => new Promise<void>((r) => setTimeout(r, delay));

export interface WorkspaceProps {}

const Workspace: React.FC<WorkspaceProps> = () => {
  const [hasLoaded, setHasLoaded] = useValue<boolean>(false);
  const [instances, setInstances] = useState<WidgetInstance[]>([]);
  const workspaceStateChannel = useChannel<WorkspaceState>(WORKSPACE_STATE_CHANNEL);
  const workspaceStateAckChannel = useChannel(WORKSPACE_STATE_ACK_CHANNEL);
  const saveWidgetBoundsChannel = useChannel<WorkspaceStateSave>(WIDGET_SAVE_BOUNDS_CHANNEL);

  useEffect(() => {
    if (hasLoaded) {
      saveWidgetBoundsChannel.dispatch({ instances });
    }
  }, [instances]);

  useEffect(() => {
    const workspaceStateListener: Listener<WorkspaceState> = async (_, worspaceState) => {
      const { widgetInstances, widgetScripts } = worspaceState;

      await wait();

      workspaceStateAckChannel.dispatch("");

      await Promise.all(widgetScripts.map((src) => window.scriptRegistry.add(src)));
      setInstances(widgetInstances);

      await wait();

      setHasLoaded(true);
    };

    workspaceStateChannel.subscribe(workspaceStateListener);
    return () => {
      workspaceStateChannel.unsubscribe(workspaceStateListener);
    };
  }, []);

  return (
    <FixedWrapper top={0} left={0} width={100} height={100}>
      <ReviverLayout
        data={instances.map(
          (instance): RevivableComponent => ({
            type: "widget-control",
            id: instance.id,
            props: {
              top: instance.top,
              left: instance.left,
              width: instance.width,
              height: instance.height,
              id: instance.id,
            },
            children: [{ type: "widget", props: { alias: instance.alias, id: instance.id } }],
          })
        )}
      />
    </FixedWrapper>
  );
};

export default Workspace;
