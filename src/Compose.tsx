import React, { useState, ChangeEvent } from 'react';
import styled from 'styled-components';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-elixir';
import 'ace-builds/src-noconflict/theme-terminal';
import 'ace-builds/src-noconflict/keybinding-vim';

const Title = styled.h1`
  text-align: center;
  padding-top: 10px;
  color: #edd;
`;
const TextArea = styled.textarea`
  height: 70%;
  width: 80%;
  font-size: 20px;
  margin-left: 10%;
`;
const Space = styled.div`
  background-color: #454343;
  height: 100vh;
`;

function Compose() {
  const x = '{ f: 220, l: 1, g: 1, p: 0 }\n\nmain = {\n\tTm 1\n}';
  const [language, setLanguage] = useState<string>(x);

  return (
    <Space>
      <Title>WereSoCool</Title>
      <AceEditor
        placeholder="Placeholder Text"
        mode="elixir"
        theme="terminal"
        name="wsc"
        keyboardHandler="vim"
        onChange={setLanguage}
        fontSize={24}
        showPrintMargin={true}
        showGutter={true}
        highlightActiveLine={true}
        value={language}
        setOptions={{
          enableBasicAutocompletion: false,
          enableLiveAutocompletion: false,
          enableSnippets: false,
          showLineNumbers: true,
          tabSize: 2,
        }}
        style={{
          height: '80vh',
          width: '80vw',
          marginLeft: '10vw',
        }}
      />
    </Space>
  );
}

export default Compose;
