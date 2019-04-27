import React from 'react';
import ReactDOM from 'react-dom';
import Renderer from './Renderer';

interface State {
  song: string;
}

export default class App extends React.Component<{}, State> {
  private renderSpace: HTMLDivElement | null;
  constructor(props: {}) {
    super(props);
    this.renderSpace = null;
    this.state = {
      song: 'hilbert',
    };
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

  public componentDidMount() {
    const song: string = window.location.search.substring(1) || this.state.song;
    this.updateSong(song);
  }

  public updateSong = (song: string) => {
    if (this.renderSpace) {
      ReactDOM.unmountComponentAtNode(this.renderSpace);
      ReactDOM.render(<Renderer song={song} />, this.renderSpace);
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
          top: '0',
        }}
      >
        <p>Song: </p>
        <select onChange={el => this.updateSong(el.target.value)} value={this.state.song}>
          {this.songNames().map((song, n) => {
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

  private songNames = (): string[] => {
    return [
      'airplane',
      'bach_fugue_1',
      'bach_prelude_2',
      'bach_prelude_3',
      'herring',
      'hilbert',
      'ezra_the_sims',
      'home',
      'lines',
      'monica',
      '23rd_St_and_6th_Avenue',
      'sketch',
      'television',
      'temecula',
      'tokyo',
      'trisha_brown',
    ];
  };
}
