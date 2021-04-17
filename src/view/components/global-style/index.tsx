import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
    overflow: hidden;
  }

  * {
    box-sizing: border-box;
  }

  body {
    width: 100vw;
    height: 100vh;
    position: relative;
    background-color: rgba(255, 255, 255, 0);
    font-family: 'Roboto', Arial, sans-serif;
  }
`;

export default GlobalStyle;
