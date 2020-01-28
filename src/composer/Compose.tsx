import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import AceEditor from 'react-ace';
import template from './template';
import './theme';
import axios from 'axios';

import 'ace-builds/src-noconflict/mode-elixir';
import 'ace-builds/src-noconflict/theme-terminal';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/keybinding-vim';

import WSCMode from './mode.js';

const customMode = new WSCMode();
const audioCtx = new AudioContext();

function Compose() {
  const [vim, setVim] = useState<boolean>(true);
  const [renderSpace, setRenderSpace] = useState<AceEditor | null>();
  const [language, setLanguage] = useState<string>(template);

  const [render, setRender] = useState<boolean>(false);
  const [playing, setPlaying] = useState<boolean>(false);
  const [source, setSource] = useState<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    const submit = async () => {
      if (render) {
        if (source) {
          source.stop();
        }
        const url = 'http://localhost:4599/';
        try {
          let response = await axios.post(url, { language });
          const l_buffer = new Float32Array(response.data.l_buffer);
          const r_buffer = new Float32Array(response.data.r_buffer);

          const s = audioCtx.createBufferSource();
          const buffer = audioCtx.createBuffer(2, l_buffer.length, audioCtx.sampleRate);
          buffer.copyToChannel(l_buffer, 0);
          buffer.copyToChannel(r_buffer, 1);

          s.connect(audioCtx.destination);
          s.buffer = buffer;
          s.start();
          setSource(s);
        } catch (err) {
          console.log(err);
        }

        setRender(false);
        setPlaying(true);
      }
    };

    submit();
  }, [render]);

  console.log(source);
  useEffect(() => {
    if (renderSpace) {
      renderSpace.editor.getSession().setMode(customMode);
      renderSpace.editor.setTheme('ace/theme/wsc');
    }
  }, [renderSpace]);

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
        focus={true}
        ref={el => {
          setRenderSpace(el);
        }}
        placeholder="WereSoCool"
        mode="elixir"
        theme="github"
        name="aceEditor"
        keyboardHandler={vim ? 'vim' : ''}
        value={language}
        onChange={l => setLanguage(l)}
        fontSize={20}
        showPrintMargin={true}
        showGutter={true}
        highlightActiveLine={true}
        setOptions={{
          showLineNumbers: true,
          tabSize: 2,
        }}
        commands={[
          {
            name: 'submit',
            bindKey: { win: 'Shift-Enter', mac: 'Shift-Enter' },
            exec: () => {
              setRender(true);
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

export default Compose;
