import { useEffect, useMemo, useState } from "react";
import { AppInstances, Listener, WidgetInstance, WorkspaceState, WorkspaceStateSave } from "@app-types";
import useChannel from "@hooks/useChannel";
import { WIDGET_SAVE_BOUNDS_CHANNEL, WORKSPACE_STATE_ACK_CHANNEL, WORKSPACE_STATE_CHANNEL } from "@constants";
import { useScriptRegistry } from "@components/script-registry";

const wait = (delay: number = 1) => new Promise<void>((r) => setTimeout(r, delay));

type SaveWorkspace = (currentInstances: AppInstances) => void;

const useWorkspace = (): [{ [id: string]: WidgetInstance }, SaveWorkspace] => {
  const scriptRegistry = useScriptRegistry();
  const [instances, setInstances] = useState<AppInstances>({});
  const workspaceStateChannel = useChannel<WorkspaceState>(WORKSPACE_STATE_CHANNEL);
  const workspaceStateAckChannel = useChannel(WORKSPACE_STATE_ACK_CHANNEL);
  const saveWidgetBoundsChannel = useChannel<WorkspaceStateSave>(WIDGET_SAVE_BOUNDS_CHANNEL);
  const saveWorkspace = useMemo(
    (): SaveWorkspace => (currentInstances) => saveWidgetBoundsChannel.dispatch({ instances: currentInstances }),
    [saveWidgetBoundsChannel]
  );

  useEffect(() => {
    const workspaceStateListener: Listener<WorkspaceState> = async (_, { instances: inst, apps }) => {
      await wait();

      workspaceStateAckChannel.dispatch("");

      await Promise.all(Object.keys(apps).map((alias) => scriptRegistry.add(alias, apps[alias])));
      setInstances(inst);
    };

    workspaceStateChannel.subscribe(workspaceStateListener);
    return () => {
      workspaceStateChannel.unsubscribe(workspaceStateListener);
    };
  }, []);

  return [instances, saveWorkspace];
};

export default useWorkspace;
