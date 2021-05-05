import styled from "styled-components";

const ContextMenuItem = styled.div`
  cursor: pointer;
  padding: 6px 12px;
  background: transparent;
  transition: all 0.2s ease-in-out;

  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }
`;

export default ContextMenuItem;
