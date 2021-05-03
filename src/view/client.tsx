import React from "react";
import { render } from "react-dom";
import App from "../components/app";

if (window) {
  render(<App />, document.getElementById("root"));
}
