// @flow
import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './containers/App';
import MainPage from './containers/MainPage';
import CounterPage from './containers/CounterPage';


export default (
  <Route path="/" component={App}>
    <IndexRoute component={MainPage} />
    <Route path="/counter" component={CounterPage} />
  </Route>
);
