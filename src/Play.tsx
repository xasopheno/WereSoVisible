import React, { useState, useEffect, Dispatch, SetStateAction, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useParams } from 'react-router-dom';
import Renderer from './Renderer';
import styled from 'styled-components';
import axios from 'axios';

const Title = styled.h1`
  text-align: center;
  padding-top: 10px;
  color: #edd;
  font-size: 1.5em;
`;

const SongSelectDropDown = styled.div`
  margin-right: 10px;
  position: absolute;
  right: 0;
  top: 10px;
`;

function songSelect(song: string, songList: string[], setSong: (song: string) => void) {
  return (
    <SongSelectDropDown>
      <select onChange={e => setSong(e.target.value)} value={song}>
        {songList.map((song, n) => {
          return (
            <option key={n} value={song}>
              {song}
            </option>
          );
        })}
      </select>
    </SongSelectDropDown>
  );
}

const Play = () => {
  let { id } = useParams();
  if (!id) id = '';

  const [song, setSong] = useState<string>(id);
  const [songList, setSongList] = useState([]);
  const [renderSpace, setRenderSpace] = useState<HTMLDivElement | null>();
  const ws = useRef(new WebSocket('ws://127.0.0.1:3012'));

  const updateSong = (song: string) => {
    console.log(song);
    if (renderSpace) {
      ReactDOM.unmountComponentAtNode(renderSpace);
      ReactDOM.render(<Renderer song={song} autoplay={false} />, renderSpace);
    }
  };

  const fetchData = async () => {
    const url = 'http://localhost:7777/songs/song_list.json';
    let response = await axios(url);
    let songs = await response.data.songs;

    setSongList(songs);
  };

  useEffect(() => {
    ws.current.onopen = () => {
      ws.current.send('WereSoVisible');
    };

    ws.current.onmessage = (event: MessageEvent) => {
      console.log(event.data);
      if (event.data === 'update') {
        setSong(song);
      }
    };
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    updateSong(song);
  }, [renderSpace]);

  useEffect(() => () => ws.current.close(), [ws]);

  return (
    <div>
      <Title>Play: {song}</Title>

      <div>
        <div
          ref={el => {
            setRenderSpace(el);
          }}
        />
      </div>
      {songSelect(song, songList, updateSong)}
    </div>
  );
};

export default Play;
