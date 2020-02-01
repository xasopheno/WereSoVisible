import styled from 'styled-components';

export const Title = styled.h1`
  font-family: 'Courier New', Courier, monospace;
  text-align: center;
  padding-top: 10px;
  color: #edd;
  font-size: 1.5em;
`;

export const SubTitle = styled.p`
  font-family: 'Courier New', Courier, monospace;
  text-align: center;
  color: #cbb;
  font-size: 8;
`;

export const Space = styled.div`
  background-color: #454343;
  height: 100vh;
`;

export const VimBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-right: 10%;
`;

export const VimText = styled.label`
  font-family: 'Courier New', Courier, monospace;
  text-align: center;
  color: #cbb;
  font-size: 1em;
  padding-right: 0.2em;
`;

export const CheckBox = styled.input`
  vertical-align: middle;
`;
