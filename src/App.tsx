import React from 'react';
import Renderer from './Renderer';

export default class App extends React.Component<{}, {}> {
  constructor(props: {}) {
    super(props);

    this.state = {};
  }

  public render() {
    return (
      <div>
        <Renderer />
      </div>
    );
  }

  private songNames = (): string[] => {
    return [
      'airplane',
      'bach_fugue_1',
      'bach_prelude_2',
      'bach_prelud3_3',
      'home',
      'monica',
      'television',
      'temecula',
      'tokyo',
      'trisha_brown',
    ];
  };
}
