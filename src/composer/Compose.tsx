import React, { useState } from 'react';
import styled from 'styled-components';
import AceEditor from 'react-ace';
import template from './template';

import 'ace-builds/src-noconflict/mode-elixir';
import 'ace-builds/src-noconflict/theme-terminal';
import 'ace-builds/src-noconflict/keybinding-vim';

const Title = styled.h1`
  text-align: center;
  padding-top: 10px;
  color: #edd;
  font-size: 1.5em;
`;

const SubTitle = styled.p`
  text-align: center;
  color: #cbb;
  font-size: 8;
`;

const Space = styled.div`
  background-color: #454343;
  height: 100vh;
`;

const VimBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-right: 10%;
`;

const VimText = styled.label`
  text-align: center;
  color: #cbb;
  font-size: 1em;
  padding-right: 0.2em;
`;

const CheckBox = styled.input`
  vertical-align: middle;
`;

enum Keyboard {
  Vim = 'vim',
  None = '',
}

function Compose() {
  const x = '{ f: 220, l: 1, g: 1, p: 0 }\n\nmain = {\n\tTm 1\n}';
  const [language, setLanguage] = useState<string>(template);
  const [vim, setVim] = useState<boolean>(true);
  const [selected, setSelected] = useState([0, 0]);

  const onSelectionChange = (l: any) => {
    const sorted = [l.lead.row, l.anchor.row].sort((a, b) => a - b);
    setSelected(sorted);
  };
  const onUpdate = (l: string) => {
    setLanguage(l);
  };

  return (
    <Space>
      <Title>WereSoCool</Title>
      <SubTitle>Make cool sounds. Impress your friends/pets/plants.</SubTitle>
      <VimBox>
        <VimText>{vim ? 'Vim!' : 'Vim?'}</VimText>
        <CheckBox
          name="Vim"
          type="checkbox"
          checked={vim ? true : false}
          onChange={() => setVim(!vim)}
        />
      </VimBox>
      <AceEditor
        placeholder="WereSoCool"
        mode="elixir"
        theme="terminal"
        name="wsc"
        keyboardHandler={vim ? Keyboard.Vim : Keyboard.None}
        onChange={l => onUpdate(l)}
        onSelectionChange={s => onSelectionChange(s)}
        fontSize={20}
        showPrintMargin={true}
        showGutter={true}
        highlightActiveLine={true}
        value={language}
        setOptions={{
          showLineNumbers: true,
          tabSize: 2,
        }}
        commands={[
          {
            name: 'render',
            bindKey: { win: 'Shift-Enter', mac: 'Shift-Enter' },
            exec: () => {
              console.log('submit');
            },
          },
        ]}
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
