import * as React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Compose from './composer/Compose';
import Play from './Play';

class Paths extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/compose" children={<Compose />} />
          <Route path="/play/:id" children={<Play />} />
          <Redirect from="/" to="/play/table" />
        </Switch>
      </Router>
    );
  }
}

export default Paths;
