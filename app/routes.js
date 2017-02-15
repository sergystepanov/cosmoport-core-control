// @flow
import React from 'react';
import {Route, IndexRoute} from 'react-router';

import App from './containers/App';
import MainPage from './containers/MainPage';
import TranslationContainer from './containers/TranslationContainer';
import TableContainer from './containers/TableContainer';

export default(
  <Route path="/" component={App}>
    <IndexRoute component={MainPage}/>
    <Route path="/translation" component={TranslationContainer}/>
    <Route path="/table" component={TableContainer}/>
  </Route>
);
