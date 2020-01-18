import * as React from 'react';
import { BrowserRouter as Router, Route, Switch, useParams } from 'react-router-dom';
//import App from './App';
import Compose from './Compose';
import Play from './Play';

class Paths extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/compose" children={<Compose />} />
          <Route path="/play/:id" children={<Play />} />
        </Switch>
      </Router>
    );
  }
}

export default Paths;

