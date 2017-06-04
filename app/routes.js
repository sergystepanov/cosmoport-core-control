import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './containers/App';
import MainPage from './containers/MainPage';
import SimulationContainer from './containers/SimulationContainer';
import TranslationContainer from './containers/TranslationContainer';
import TableContainer from './containers/TableContainer';
import SettingsContainer from './containers/SettingsContainer';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={MainPage} />
    <Route path="/simulation" component={SimulationContainer} />
    <Route path="/translation" component={TranslationContainer} />
    <Route path="/table" component={TableContainer} />
    <Route path="/settings" component={SettingsContainer} />
  </Route>
);
