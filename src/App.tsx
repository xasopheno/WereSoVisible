import React from 'react';
import ReactDOM from 'react-dom';
import Renderer from './Renderer';

interface State {
  song: string;
  songs: string[];
}

export default class App extends React.Component<{}, State> {
  private renderSpace: HTMLDivElement | null;
  private ws: WebSocket | null;
  constructor(props: {}) {
    super(props);
    this.renderSpace = null;
    this.ws = null; 
    this.state = {
      song: 'herring',
      songs: [],
    };
  }

  public setupSocket(): WebSocket {
    const ws = new WebSocket('ws://127.0.0.1:3012');

    ws.onopen = function open(event) {
      ws.send('WereSoVisible');
    };

    ws.onmessage = (event: MessageEvent) => {
      console.log(event.data);
      if (event.data === 'update') {
        this.updateSong(this.state.song, true);
      }
    };

    return ws;
  }

  public componentDidMount() {
    const song: string = window.location.search.substring(1) || this.state.song;
    this.readJson();
    this.updateSong(song, false);
    this.setupSocket();
  }

  public render() {
    return (
      <div>
        <div
          ref={el => {
            this.renderSpace = el;
          }}
        />
        {this.songSelect()}
      </div>
    );
  }

  public updateSong = (song: string, autoplay: boolean) => {
    if (this.renderSpace) {
      ReactDOM.unmountComponentAtNode(this.renderSpace);
      ReactDOM.render(<Renderer song={song} autoplay={autoplay} />, this.renderSpace);
    }
    this.setState({
      song,
    });

    window.history.pushState('', '', '/?' + song);
  };

  public songSelect() {
    return (
      <div
        style={{
          marginRight: '10px',
          position: 'absolute',
          right: '0',
          top: '10px',
        }}
      >
        <select onChange={el => this.updateSong(el.target.value, true)} value={this.state.song}>
          {this.state.songs.map((song, n) => {
            return (
              <option key={n} value={song}>
                {song}
              </option>
            );
          })}
        </select>
      </div>
    );
  }

  public readJson = async () => {
    const response = await fetch(`/songs/song_list.json`);
    const json = await response.json();
    const songs = json.songs;
    this.setState({ songs });
  };
}
