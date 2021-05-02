import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import AbsoluteWrapper from "../absolute-wrapper";

export interface WidgetProps {
  partition: string;
  uri: string;
  devtools?: boolean;
}

const getWebpreferences = (uri: string) =>
  /^file:\/\/.+/.test(uri)
    ? "webviewTag, nodeIntegration, nodeIntegrationInSubFrames, nodeIntegrationInWorker, contextIsolation=false"
    : "contextIsolation, nodeIntegration=false, nodeIntegrationInSubFrames=false, webviewTag=false";

const Wrapper = styled(AbsoluteWrapper)`
  & webview {
    width: 100%;
    height: 100%;
    border: 0;
  }
`;

const Widget: React.FC<WidgetProps> = ({ devtools, partition, uri }) => {
  const element = useRef();

  useEffect(() => {
    if (element && element.current && devtools) {
      // @ts-ignore
      setTimeout(() => element.current.openDevTools(), 500);
    }
  }, [devtools]);

  return (
    <Wrapper top={0} left={0} width={100} height={100}>
      <webview src={uri} ref={element} partition={partition} webpreferences={getWebpreferences(uri)} />
    </Wrapper>
  );
};

Widget.propTypes = {
  partition: PropTypes.string.isRequired,
  uri: PropTypes.string.isRequired,
  devtools: PropTypes.bool,
};

Widget.defaultProps = {
  devtools: false,
};

export default Widget;
