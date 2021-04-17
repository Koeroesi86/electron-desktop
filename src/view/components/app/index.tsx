import React from "react";
import { ComponentRegistry, ReviverProvider } from "@koeroesi86/react-reviver";
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
    <GlobalStyle />
    <Workspace />
  </ReviverProvider>
);

export default App;
