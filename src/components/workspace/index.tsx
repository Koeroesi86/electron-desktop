import React, { useEffect, useRef, useState } from "react";
import { Listener, RevivableComponent, WidgetInstance, WorkspaceState, WorkspaceStateSave } from "@app-types";
import { ReviverLayout } from "@koeroesi86/react-reviver";
import { WIDGET_SAVE_BOUNDS_CHANNEL, WORKSPACE_STATE_ACK_CHANNEL, WORKSPACE_STATE_CHANNEL } from "@constants";
import useIpc from "@hooks/useIpc";
import FixedWrapper from "../fixed-wrapper";

const wait = (delay: number = 1) => new Promise<void>((r) => setTimeout(r, delay));

export interface WorkspaceProps {}

const Workspace: React.FC<WorkspaceProps> = () => {
  const hasLoaded = useRef(false);
  const [instances, setInstances] = useState<WidgetInstance[]>([]);
  const workspaceStateChannel = useIpc<WorkspaceState>(WORKSPACE_STATE_CHANNEL);
  const workspaceStateAckChannel = useIpc<WorkspaceState>(WORKSPACE_STATE_ACK_CHANNEL);
  const saveWidgetBoundsChannel = useIpc<WorkspaceStateSave>(WIDGET_SAVE_BOUNDS_CHANNEL);

  useEffect(() => {
    if (hasLoaded.current) {
      saveWidgetBoundsChannel.dispatch({ instances });
    }
  }, [instances]);

  useEffect(() => {
    const workspaceStateListener: Listener<WorkspaceState> = async (_, state) => {
      const { widgetInstances, widgetScripts } = state;

      await wait();

      workspaceStateAckChannel.dispatch();

      await Promise.all(widgetScripts.map((src) => window.scriptRegistry.add(src)));
      setInstances(widgetInstances);

      await wait();

      hasLoaded.current = true;
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
            children: [{ type: "widget", props: { alias: instance.alias, initialState: instance.state, id: instance.id } }],
          })
        )}
      />
    </FixedWrapper>
  );
};

export default Workspace;
