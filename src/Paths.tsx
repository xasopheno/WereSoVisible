import * as React from 'react';
import { StaticRouter as Router, Route, Switch } from 'react-router';
import App from './App';
import Compose from './Compose';

class Paths extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/compose">
            <Compose />
          </Route>
          <Route path="/">
            <App />
          </Route>
        </Switch>
      </Router>
    );
  }
}

export default Paths;
