import React from "react";
import ApiClientProvider, { AdapterVersion } from "../api-client";
import { ScriptProvider } from "../script-registry";
import GlobalStyle from "../global-style";
import Workspace from "../workspace";

const App: React.FC = () => (
  <ApiClientProvider adapter={AdapterVersion.ipc}>
    <ScriptProvider>
      <GlobalStyle />
      <Workspace />
    </ScriptProvider>
  </ApiClientProvider>
);

export default App;
