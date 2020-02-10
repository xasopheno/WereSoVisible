import React from 'react';
import styled from 'styled-components';

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
        <PlayButton onClick={this.props.startAnimation} color={'salmon'}>
          <PlayText>Play</PlayText>
        </PlayButton>
      );
    } else {
      return (
        <PlayButton color={'blue'}>
          <PlayText>Wait.</PlayText>
        </PlayButton>
      );
    }
  }

  public render() {
    return <div>{this.renderStartButton()}</div>;
  }
}

const PlayText = styled.p`
  padding-left: 1em;
  padding-right: 1em;
  color: white;
  font-size: 1.25em;
`;

const PlayButton = styled.div`
  position: absolute;
  background-color: ${props => props.color};
  top: 40px;
  right: 10px;
`;
