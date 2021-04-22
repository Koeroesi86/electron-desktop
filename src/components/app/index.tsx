import React from "react";
import { ComponentRegistry, ReviverProvider } from "@koeroesi86/react-reviver";
import ApiClientProvider, { AdapterVersion } from "@components/api-client";
import GlobalStyle from "../global-style";
import Workspace from "../workspace";
import WidgetControls from "../widget-controls";
import FixedWrapper from "../fixed-wrapper";
import AbsoluteWrapper from "../absolute-wrapper";
import Widget from "../widget";

const components: ComponentRegistry = {
  "absolute-wrapper": AbsoluteWrapper,
  "fixed-wrapper": FixedWrapper,
  "widget-control": WidgetControls,
  widget: Widget,
  workspace: Workspace,
};

const App: React.FC = () => (
  <ReviverProvider components={components}>
    <ApiClientProvider adapter={AdapterVersion.ipc}>
      <GlobalStyle />
      <Workspace />
    </ApiClientProvider>
  </ReviverProvider>
);

export default App;
