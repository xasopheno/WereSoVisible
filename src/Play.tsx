import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useParams, useHistory } from 'react-router-dom';
import Renderer from './Renderer3';
import styled from 'styled-components';
import axios from 'axios';
import Data from './Data';

const Title = styled.h1`
  color: #454;
  font-size: 1.5em;
`;

const TitleWrapper = styled.div`
  position: absolute;
  width: 100%;
  text-align: center;
`;

const SongSelectDropDown = styled.div`
  margin-right: 10px;
  position: absolute;
  right: 0;
  top: 10px;
`;

const Select = styled.select`
  height: 1.5em;
  font-size: 1.1em;
`;

//const getData = async (song: string): Promise<Data> => {
////const audio = new Sound(song);
//const data = new Data();
//await data.getData(song);
//return data;
//};

const songSelect = (
  song: string,
  songList: string[],
  updateSong: (song: string, autoplay: boolean) => void
) => {
  if (songList.length > 0) {
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
  } else {
    return (
      <SongSelectDropDown>
        <Select onChange={e => {}} value={'none'}>
          <option>None</option>
        </Select>
      </SongSelectDropDown>
    );
  }
};

const Play = () => {
  let { id } = useParams();
  if (!id) id = '';

  const [song, setSong] = useState<string>(id);
  const [data, setData] = useState<Data | null>(null);
  const [songList, setSongList] = useState([]);
  const [renderSpace, setRenderSpace] = useState<HTMLDivElement | null>();
  const history = useHistory();

  if (process.env.LOCAL) {
    const ws = useRef(new WebSocket('ws://127.0.0.1:3012'));

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
    useEffect(() => () => ws.current.close(), [ws]);
  }

  //useEffect(() => {
  //const getData = async () => {
  //const data = new Data();
  //await data.getData(song);

  //setData(data);
  //};
  //getData();
  //}, []);

  const updateSong = (song: string, autoplay: boolean) => {
    if (renderSpace && data) {
      ReactDOM.unmountComponentAtNode(renderSpace);
      ReactDOM.render(<Renderer song={song} autoplay={autoplay} a />, renderSpace);
    }

    setSong(song);
    history.push('/play/' + song);
  };

  const fetchData = async () => {
    const url = `http://${process.env.SERVER_LOCATION}/api/songs/song_list.json`;
    let response = await axios(url);
    let songs = await response.data.songs;

    setSongList(songs);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    updateSong(song, false);
  }, [renderSpace, data]);

  return (
    <div>
      {/*<TitleWrapper>*/}
      {/*<Title>{song}</Title>*/}
      {/*</TitleWrapper>*/}

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
