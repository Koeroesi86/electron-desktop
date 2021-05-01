import React, { useEffect, useMemo, useRef } from "react";
import PropTypes from "prop-types";
import AbsoluteWrapper from "../absolute-wrapper";

export interface WidgetProps {
  alias: string;
  id: string;
}

const getWebpreferences = (uri: string) =>
  /^file:\/\/.+/.test(uri)
    ? "webviewTag, nodeIntegration, nodeIntegrationInSubFrames, nodeIntegrationInWorker, contextIsolation=false"
    : "contextIsolation, nodeIntegration=false, nodeIntegrationInSubFrames=false, webviewTag=false";

const Widget: React.FC<WidgetProps> = ({ alias, id }) => {
  const script = useMemo(() => window.scriptRegistry.get(alias), [alias]);
  const element = useRef();

  useEffect(() => {
    if (element && element.current) {
      // @ts-ignore
      setTimeout(() => element.current.openDevTools(), 500);
    }
  }, []);

  return (
    <AbsoluteWrapper top={0} left={0} width={100} height={100}>
      {script && (
        <webview
          style={{ width: "100%", height: "100%", border: 0 }}
          src={script.uri}
          ref={element}
          partition={`persist:widget-${id}}`}
          webpreferences={getWebpreferences(script.uri)}
        />
      )}
    </AbsoluteWrapper>
  );
};

Widget.propTypes = {
  alias: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};

export default Widget;
