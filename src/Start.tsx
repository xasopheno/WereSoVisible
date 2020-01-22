import React from 'react';

interface Props {
  play: boolean;
  ready: boolean;
  startAnimation: () => void;
}

export default class Start extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
  }

  public renderStartButton() {
    if (this.props.play && this.props.ready) {
      return;
    } else if (this.props.ready) {
      return (
        <div
          onClick={this.props.startAnimation}
          style={{ position: 'absolute', backgroundColor: 'salmon', top: '40px', right: '10px' }}
        >
          <p style={{ paddingLeft: '5px', paddingRight: '5px', color: 'white', size: '14px' }}>
            Start
          </p>
        </div>
      );
    } else {
      return (
        <div style={{ position: 'absolute', backgroundColor: 'blue', top: '40px', right: '10px' }}>
          <p style={{ paddingLeft: '5px', paddingRight: '5px', color: 'white', size: '14px' }}>
            Wait.
          </p>
        </div>
      );
    }
  }

  public render() {
    return <div>{this.renderStartButton()}</div>;
  }
}
