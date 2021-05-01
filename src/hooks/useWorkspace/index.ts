import { useEffect, useMemo, useState } from "react";
import { Listener, WidgetInstance, WorkspaceState, WorkspaceStateSave } from "@app-types";
import useChannel from "@hooks/useChannel";
import { WIDGET_SAVE_BOUNDS_CHANNEL, WORKSPACE_STATE_ACK_CHANNEL, WORKSPACE_STATE_CHANNEL } from "@constants";

const wait = (delay: number = 1) => new Promise<void>((r) => setTimeout(r, delay));

type SaveWorkspace = (currentInstances: WidgetInstance[]) => void;

const useWorkspace = (): [WidgetInstance[], SaveWorkspace] => {
  const [instances, setInstances] = useState<WidgetInstance[]>([]);
  const workspaceStateChannel = useChannel<WorkspaceState>(WORKSPACE_STATE_CHANNEL);
  const workspaceStateAckChannel = useChannel(WORKSPACE_STATE_ACK_CHANNEL);
  const saveWidgetBoundsChannel = useChannel<WorkspaceStateSave>(WIDGET_SAVE_BOUNDS_CHANNEL);
  const saveWorkspace = useMemo((): SaveWorkspace => (currentInstances) => saveWidgetBoundsChannel.dispatch({ instances: currentInstances }), [
    saveWidgetBoundsChannel,
  ]);

  useEffect(() => {
    const workspaceStateListener: Listener<WorkspaceState> = async (_, worspaceState) => {
      const { widgetInstances, widgetScripts } = worspaceState;

      await wait();

      workspaceStateAckChannel.dispatch("");

      await Promise.all(widgetScripts.map((src) => window.scriptRegistry.add(src)));
      setInstances(widgetInstances);
    };

    workspaceStateChannel.subscribe(workspaceStateListener);
    return () => {
      workspaceStateChannel.unsubscribe(workspaceStateListener);
    };
  }, []);

  return [instances, saveWorkspace];
};

export default useWorkspace;
