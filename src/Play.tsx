import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { useParams } from 'react-router-dom';
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

function songSelect(song: string, songList: string[], setSong: Dispatch<SetStateAction<string>>) {
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

  async function fetchData() {
    const url = 'http://localhost:7777/songs/song_list.json';
    let response = await axios(url);
    let songs = await response.data.songs;
    setSongList(songs);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <Title>Play: {song}</Title>
      {songSelect(song, songList, setSong)}
    </div>
  );
};

export default Play;
