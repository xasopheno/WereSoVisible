import AceEditor, { IMarker } from 'react-ace';
import axios from 'axios';
import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';
import './theme';

import WSCMode from './mode.js';
import template from './template';

import 'ace-builds/src-noconflict/mode-elixir';
import 'ace-builds/src-noconflict/theme-terminal';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/keybinding-vim';

const BACKEND_RENDER_URL = `http://${process.env.SERVER_LOCATION}/api/render`;
const customMode = new WSCMode();

interface Render {
  l_buffer: Float32Array;
  r_buffer: Float32Array;
}

interface RenderError {
  message: string;
  line: number;
  column: number;
}

const audioCtx = new AudioContext();

function Compose() {
  const [vim, setVim] = useState<boolean>(true);
  const [renderSpace, setRenderSpace] = useState<AceEditor | null>();
  const [language, setLanguage] = useState<string>(template);

  const [render, setRender] = useState<boolean>(false);
  const [node, setNode] = useState<number>(0);
  const [s1, set1] = useState<AudioBufferSourceNode | null>(null);
  const [s2, set2] = useState<AudioBufferSourceNode | null>(null);

  const [g1, setG1] = useState<GainNode>(new GainNode(audioCtx));
  const [g2, setG2] = useState<GainNode>(new GainNode(audioCtx));
  const [markers, setMarkers] = useState<IMarker[]>([]);

  const gainNodes = [g1, g2];
  const setGainNodes = [setG1, setG2];

  const sources = [s1, s2];
  const setSources = [set1, set2];

  const playNewAudio = (
    data: Render,
    setSource: Dispatch<SetStateAction<AudioBufferSourceNode | null>>,
    setGainNode: Dispatch<SetStateAction<GainNode>>
  ) => {
    const l_buffer = new Float32Array(data.l_buffer);
    const r_buffer = new Float32Array(data.r_buffer);

    const s = audioCtx.createBufferSource();
    const buffer = audioCtx.createBuffer(2, l_buffer.length, audioCtx.sampleRate);
    buffer.copyToChannel(l_buffer, 0);
    buffer.copyToChannel(r_buffer, 1);

    const g = new GainNode(audioCtx);
    g.connect(audioCtx.destination);
    s.buffer = buffer;
    s.connect(g);
    s.start();
    setSource(s);
    setGainNode(g);
  };

  const fadeOutSource = (source: AudioBufferSourceNode | null, gainNode: GainNode) => {
    if (source) {
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.05);
      source.stop(audioCtx.currentTime + 0.05);
    }
  };

  useEffect(() => {
    const submit = async () => {
      if (render) {
        setMarkers([]);
        setNode((node + 1) % 2);

        const lastSource = sources[(node + 1) % 2];
        const lastGainNode = gainNodes[(node + 1) % 2];
        const setSource = setSources[node];
        const setGainNode = setGainNodes[node];

        fadeOutSource(lastSource, lastGainNode);

        try {
          let response = await axios.post(BACKEND_RENDER_URL, { language });
          if (renderSpace) {
            switch (response.data.response_type) {
              case 'RenderSuccess':
                playNewAudio(response.data.buffers, setSource, setGainNode);
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

const displayError = (
  error: RenderError,
  n_lines: number,
  renderSpace: AceEditor,
  setMarkers: Dispatch<SetStateAction<IMarker[]>>
) => {
  setMarkers([makeMarker(error.line, error.column, n_lines)]);
  renderSpace.editor.gotoLine(error.line, error.column);
};
const makeMarker = (line: number, column: number, n_lines: number): IMarker => {
  line -= 1;
  return {
    startRow: line,
    startCol: column,
    endRow: n_lines,
    endCol: 0,
    type: 'text',
    className: 'error',
  };
};

const Title = styled.h1`
  font-family: 'Courier New', Courier, monospace;
  text-align: center;
  padding-top: 10px;
  color: #edd;
  font-size: 1.5em;
`;

const SubTitle = styled.p`
  font-family: 'Courier New', Courier, monospace;
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
  font-family: 'Courier New', Courier, monospace;
  text-align: center;
  color: #cbb;
  font-size: 1em;
  padding-right: 0.2em;
`;

const CheckBox = styled.input`
  vertical-align: middle;
`;

export default Compose;
