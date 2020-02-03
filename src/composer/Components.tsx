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
  text-align: bottom;
  color: #cbb;
  font-size: 1em;
  padding-right: 0.2em;
`;

export const CheckBox = styled.input`
  vertical-align: middle;
  margin-bottom: 0px;
`;

export const ButtonBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  margin-left: 10%;
`;

export const Button = styled.button`
  font-size: 1em;
  background-color: #454343;
  margin-right: 2em;
  color: #edd;
  &:visited {
    outline: none;
  }
  &:active {
    outline: none;
  }
  &:focus {
    outline: none;
  }
`;

export const TopBox = styled.div`
  display: flex;
  justify-content: space-between;
`;

