import React, { useEffect, useMemo, useRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import AbsoluteWrapper from "../absolute-wrapper";

export interface WidgetProps {
  alias: string;
  id: string;
  devtools?: boolean;
}

const getWebpreferences = (uri: string) =>
  /^file:\/\/.+/.test(uri)
    ? "webviewTag, nodeIntegration, nodeIntegrationInSubFrames, nodeIntegrationInWorker, contextIsolation=false"
    : "contextIsolation, nodeIntegration=false, nodeIntegrationInSubFrames=false, webviewTag=false";

const getPartition = (id: string) => `persist:widget-${id}}`;

const Wrapper = styled(AbsoluteWrapper)`
  & webview {
    width: 100%;
    height: 100%;
    border: 0;
  }
`;

const Widget: React.FC<WidgetProps> = ({ alias, id, devtools }) => {
  const script = useMemo(() => window.scriptRegistry.get(alias), [alias]);
  const element = useRef();

  useEffect(() => {
    if (element && element.current && devtools) {
      // @ts-ignore
      setTimeout(() => element.current.openDevTools(), 500);
    }
  }, [script, devtools]);

  return (
    <Wrapper top={0} left={0} width={100} height={100}>
      {script && <webview src={script.uri} ref={element} partition={getPartition(id)} webpreferences={getWebpreferences(script.uri)} />}
    </Wrapper>
  );
};

Widget.propTypes = {
  alias: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  devtools: PropTypes.bool,
};

Widget.defaultProps = {
  devtools: false,
};

export default Widget;
