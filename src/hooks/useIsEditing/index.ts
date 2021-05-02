import { useEffect, useState } from "react";
import { Listener, WorkspaceEdit } from "@app-types";
import useChannel from "@hooks/useChannel";
import { WORKSPACE_EDIT_CHANNEL } from "@constants";

const useIsEditing = () => {
  const [editing, setEditing] = useState(false);
  const workspaceEditChannel = useChannel<WorkspaceEdit>(WORKSPACE_EDIT_CHANNEL);

  useEffect(() => {
    const workspaceEditListener: Listener<WorkspaceEdit> = (_, { isEdit }) => setEditing(isEdit);

    workspaceEditChannel.subscribe(workspaceEditListener);
    return () => {
      workspaceEditChannel.unsubscribe(workspaceEditListener);
    };
  }, []);

  return [editing];
};

export default useIsEditing;
