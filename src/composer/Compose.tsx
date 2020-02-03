import AceEditor, { IMarker } from 'react-ace';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import './theme';
import {
  Space,
  Title,
  SubTitle,
  VimBox,
  VimText,
  CheckBox,
  Button,
  ButtonBox,
  TopBox,
} from './Components';

import WSCMode from './mode.js';
import template from './template';
import { playNewAudio, fadeOutSource, displayError } from './utils';

import 'ace-builds/src-noconflict/mode-elixir';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/keybinding-vim';

const BACKEND_RENDER_URL = `http://${process.env.SERVER_LOCATION}/api/render`;
const customMode = new WSCMode();

const audioCtx = new AudioContext();

function Compose() {
  const [vim, setVim] = useState<boolean>(true);
  const [renderSpace, setRenderSpace] = useState<AceEditor | null>();
  const [language, setLanguage] = useState<string>(template);

  const [render, setRender] = useState<boolean>(false);
  const [save, setSave] = useState<boolean>(false);

  const [node, setNode] = useState<number>(0);
  const [sourceNode1, setSourceNode1] = useState<AudioBufferSourceNode | null>(null);
  const [sourceNode2, setSourceNode2] = useState<AudioBufferSourceNode | null>(null);

  const [gainNode1, setGainNode1] = useState<GainNode>(new GainNode(audioCtx));
  const [gainNode2, setGainNode2] = useState<GainNode>(new GainNode(audioCtx));
  const [markers, setMarkers] = useState<IMarker[]>([]);

  const gainNodes = [gainNode1, gainNode2];
  const setGainNodes = [setGainNode1, setGainNode2];

  const sources = [sourceNode1, sourceNode2];
  const setSources = [setSourceNode1, setSourceNode2];

  useEffect(() => {
    const submit = async () => {
      if (render) {
        setMarkers([]);
        setNode((node + 1) % 2);

        const lastSource = sources[(node + 1) % 2];
        const lastGainNode = gainNodes[(node + 1) % 2];
        const setSource = setSources[node];
        const setGainNode = setGainNodes[node];

        fadeOutSource(audioCtx, lastSource, lastGainNode);

        try {
          let response = await axios.post(BACKEND_RENDER_URL, { language });
          if (renderSpace) {
            switch (response.data.response_type) {
              case 'RenderSuccess':
                localStorage.setItem('language', language);
                playNewAudio(audioCtx, response.data.buffers, setSource, setGainNode);
                break;
              case 'RenderError':
                const error = response.data.error;
                const n_lines = language.split('\n').length;
                displayError(error, n_lines, renderSpace, setMarkers);
                break;
              default:
                console.log('Not sure how we got here...');
                console.log(response);
                break;
            }
          }
        } catch (err) {
          console.log(err);
        }

        setRender(false);
      }
    };

    submit();
  }, [render]);

  useEffect(() => {
    if (renderSpace) {
      renderSpace.editor.getSession().setMode(customMode);
      renderSpace.editor.setTheme('ace/theme/wsc');
    }
  }, [renderSpace]);

  const getStoredLanguage = () => {
    const stored = localStorage.getItem('language');
    if (stored) {
      setLanguage(stored);
    }
  };

  useEffect(() => {
    getStoredLanguage();
  }, []);

  useEffect(() => {
    if (save) {
      setSave(false);
    }
  }, [save]);

  const stopAudio = () => {
    fadeOutSource(audioCtx, sources[(node + 1) % 2], gainNodes[(node + 1) % 2]);
  };
  return (
    <Space>
      <Title>WereSoCool</Title>
      <SubTitle>Make cool sounds. Impress your friends/pets/plants.</SubTitle>
      <TopBox>
        <ButtonBox>
          <Button onClick={() => setRender(true)}>Render</Button>
          <Button onClick={() => stopAudio()}>Stop</Button>
        </ButtonBox>
        <VimBox>
          <Button onClick={() => setLanguage(template)}>Reset</Button>
          <VimText>{vim ? 'Vim!' : 'Vim?'}</VimText>
          <CheckBox
            name="Vim"
            type="checkbox"
            checked={vim ? true : false}
            onChange={() => setVim(!vim)}
          />
        </VimBox>
      </TopBox>
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
        markers={markers}
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
          {
            name: 'save',
            bindKey: { win: 'Command-s', mac: 'Command-s' },
            exec: () => {
              setSave(true);
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
