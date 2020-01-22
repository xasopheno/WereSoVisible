import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useParams, useHistory } from 'react-router-dom';
import Renderer from './Renderer';
import styled from 'styled-components';
import axios from 'axios';

const Title = styled.h1`
  text-align: center;
  padding-top: 10px;
  color: #454;
  font-size: 1.5em;
`;

const SongSelectDropDown = styled.div`
  margin-right: 10px;
  position: absolute;
  right: 0;
  top: 10px;
`;

const Select = styled.select`
  background-color: salmon;
  border: 1px solid salmon;
  height 1.5em;
  font-size: 1.1em;
`;

function songSelect(
  song: string,
  songList: string[],
  updateSong: (song: string, autoplay: boolean) => void
) {
  return (
    <SongSelectDropDown>
      <Select
        onChange={e => {
          updateSong(e.target.value, true);
        }}
        value={song}
      >
        {songList.map((song, n) => {
          return (
            <option key={n} value={song}>
              {song}
            </option>
          );
        })}
      </Select>
    </SongSelectDropDown>
  );
}

const Play = () => {
  let { id } = useParams();
  if (!id) id = '';

  const [song, setSong] = useState<string>(id);
  const [songList, setSongList] = useState([]);
  const [renderSpace, setRenderSpace] = useState<HTMLDivElement | null>();
  const history = useHistory();
  const ws = useRef(new WebSocket('ws://127.0.0.1:3012'));

  const updateSong = (song: string, autoplay: boolean) => {
    if (renderSpace) {
      ReactDOM.unmountComponentAtNode(renderSpace);
      ReactDOM.render(<Renderer song={song} autoplay={autoplay} />, renderSpace);
    }

    setSong(song);
    history.push('/play/' + song);
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
        updateSong(song, true);
      }
    };
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    updateSong(song, false);
  }, [renderSpace]);

  useEffect(() => () => ws.current.close(), [ws]);

  return (
    <div>
      <Title>{song}</Title>

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
