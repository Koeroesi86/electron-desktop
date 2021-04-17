import React, { useEffect, useRef, useState } from "react";
import { Listener, WidgetInstance, WorkspaceState, WorkspaceStateSave } from "@app-types";
import { WIDGET_SAVE_BOUNDS_CHANNEL, WORKSPACE_STATE_ACK_CHANNEL, WORKSPACE_STATE_CHANNEL } from "../../../constants";
import WidgetControls from "../widget-controls";
import FixedWrapper from "../fixed-wrapper";
import useIpc from "../../hooks/useIpc";

const wait = (delay: number = 1) => new Promise<void>((r) => setTimeout(r, delay));

const Workspace: React.FC = () => {
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
    <FixedWrapper>
      {instances.map((instance) => (
        <WidgetControls
          key={`Widget-${instance.alias}-${instance.id}`}
          top={instance.top}
          left={instance.left}
          width={instance.width}
          height={instance.height}
          alias={instance.alias}
          id={instance.id}
          initialState={instance.state}
        />
      ))}
    </FixedWrapper>
  );
};

export default Workspace;
