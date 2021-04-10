import React, {useEffect, useState, Fragment} from 'react';
import {ipcRenderer} from "electron";
import styled from "styled-components";
import {WidgetInstance} from "../../types";
import Widget from "../widget";
import WidgetControls from "../widgetControls";

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Workspace: React.FC = () => {
  const [instances, setInstances] = useState<WidgetInstance[]>([]);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    ipcRenderer.on('workspace-state', (_, state: { widgetScripts: string[], widgetInstances: WidgetInstance[] }) => {
      setTimeout(() => {
        ipcRenderer.send('received-workspace');
      }, 1);
      const { widgetInstances, widgetScripts } = state;

      Promise.resolve()
        .then(() => Promise.all(widgetScripts.map(src => window.scriptRegistry.add(src))))
        .then(() => {
          setInstances(widgetInstances);
        });
    });

    ipcRenderer.on('edit-workspace', (_, { isEdit }) => {
      setEditing(isEdit);
    });
  }, []);

  return (
    <Wrapper>
      {instances.map((instance, index) => (
        <Fragment key={`Widget-${instance.alias}-${index}`}>
          <WidgetControls
            top={instance.top}
            left={instance.left}
            width={instance.width}
            height={instance.height}
            editing={editing}
            onChange={(changedBounds) => {
              const currentInstances = instances.slice(0);
              currentInstances[index] = {
                ...instance,
                ...changedBounds,
              }
              setInstances(currentInstances);
            }}
          >
            <Widget
              alias={instance.alias}
              top={instance.top}
              left={instance.left}
              width={instance.width}
              height={instance.height}
            />
          </WidgetControls>
        </Fragment>
      ))}
    </Wrapper>
  );
}

export default Workspace;
