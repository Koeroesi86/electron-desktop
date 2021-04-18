import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
    overflow: hidden;
    background: transparent;
  }

  * {
    box-sizing: border-box;
  }

  body {
    width: 100vw;
    height: 100vh;
    position: relative;
    font-family: 'Roboto', Arial, sans-serif;
  }
`;

export default GlobalStyle;
