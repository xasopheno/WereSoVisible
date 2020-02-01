import { Dispatch, SetStateAction } from 'react';
import { Render, RenderError } from './types';
import AceEditor, { IMarker } from 'react-ace';

export const playNewAudio = (
  audioCtx: AudioContext,
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

export const fadeOutSource = (
  audioCtx: AudioContext,
  source: AudioBufferSourceNode | null,
  gainNode: GainNode
) => {
  if (source) {
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.05);
    source.stop(audioCtx.currentTime + 0.05);
  }
};

export const displayError = (
  error: RenderError,
  n_lines: number,
  renderSpace: AceEditor,
  setMarkers: Dispatch<SetStateAction<IMarker[]>>
) => {
  setMarkers([makeMarker(error.line, error.column, n_lines)]);
  renderSpace.editor.gotoLine(error.line, error.column);
};

export const makeMarker = (line: number, column: number, n_lines: number): IMarker => {
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
