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
const gainNodes = [new GainNode(audioCtx), new GainNode(audioCtx)];
gainNodes[0].connect(audioCtx.destination);
gainNodes[1].connect(audioCtx.destination);

function Compose() {
  const [vim, setVim] = useState<boolean>(true);
  const [renderSpace, setRenderSpace] = useState<AceEditor | null>();
  const [language, setLanguage] = useState<string>(template);

  const [render, setRender] = useState<boolean>(false);
  const [node, setNode] = useState<number>(0);
  const [s1, set1] = useState<AudioBufferSourceNode | null>(null);
  const [s2, set2] = useState<AudioBufferSourceNode | null>(null);

  const sources = [s1, s2];
  const setSources = [set1, set2];

  const fadeOutSource = (source: AudioBufferSourceNode | null, gainNode: GainNode) => {
    if (source) {
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.01);
      source.stop(audioCtx.currentTime + 0.01);
    }
  };

  useEffect(() => {
    const submit = async () => {
      if (render) {
        setNode((node + 1) % 2);

        console.log(node);

        const lastSource = sources[(node + 1) % 2];
        const lastGainNode = gainNodes[(node + 1) % 2];
        const setSource = setSources[node];
        const gainNode = gainNodes[node];

        fadeOutSource(lastSource, lastGainNode);

        const url = 'http://localhost:4599/';
        try {
          let response = await axios.post(url, { language });

          const l_buffer = new Float32Array(response.data.l_buffer);
          const r_buffer = new Float32Array(response.data.r_buffer);

          const s = audioCtx.createBufferSource();
          const buffer = audioCtx.createBuffer(2, l_buffer.length, audioCtx.sampleRate);
          buffer.copyToChannel(l_buffer, 0);
          buffer.copyToChannel(r_buffer, 1);

          s.buffer = buffer;

          //gainNode.gain.exponentialRampToValueAtTime(1.0, audioCtx.currentTime + 0.1);
          s.connect(gainNode);
          //gainNode.gain.exponentialRampToValueAtTime(1.0, audioCtx.currentTime + 0.01);
          //gainNode.gain.linearRampToValueAtTime(1.0, audioCtx.currentTime + 0.1);
          s.start();
          //console.log(nextSetSource);
          setSource(s);
        } catch (err) {
          console.log(err);
        }

        setRender(false);
      }
    };

    submit();
  }, [render]);
  //console.log(gainNode.gain.value);

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
