import React from 'react';
import Renderer from './Renderer';

interface State {
  song: string;
}

export default class App extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);

    this.state = {
      song: 'monica',
    };
  }

  public render() {
    return (
      <div>
        <Renderer song={this.state.song} />
        {this.songSelect()}
      </div>
    );
  }

  public updateSong = (e: React.FormEvent<HTMLSelectElement>) => {
    const song: string = e.currentTarget.value;
    this.setState({
      song,
    });
  };

  public songSelect() {
    return (
      <div
        style={{
          marginRight: '10px',
          position: 'absolute',
          right: '0',
        }}
      >
        <p>Song: </p>
        <select onChange={this.updateSong} value={this.state.song}>
          {this.songNames().map((song, n) => {
            return <option key={n} value={song}>{song}</option>;
          })}
        </select>
      </div>
    );
  }

  private songNames = (): string[] => {
    return [
      'airplane',
      'bach_fugue_1',
      'bach_prelude_2',
      'bach_prelude_3',
      'home',
      'monica',
      'television',
      'temecula',
      'tokyo',
      'trisha_brown',
    ];
  };
}
