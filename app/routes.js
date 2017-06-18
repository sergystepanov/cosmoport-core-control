/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import {
  Route,
  Switch
} from 'react-router-dom';

// import App from './containers/App';
import App from './containers/App';
// import MainPage from './containers/MainPage';
// import SimulationContainer from './containers/SimulationContainer';
// import TranslationContainer from './containers/TranslationContainer';
import TableContainer from './containers/TableContainer';
// import SettingsContainer from './containers/SettingsContainer';
// import LockContainer from './containers/LockContainer';
// import UnlockContainer from './containers/UnlockContainer';

export default () => (
  <App>
    <Switch>
      <Route component={TableContainer} />
      {/**<IndexRoute component={MainPage} />
        <Route path="/simulation" component={SimulationContainer} />
        <Route path="/translation" component={TranslationContainer} auth />
        <Route path="/table" component={TableContainer} />
        <Route path="/login" component={UnlockContainer} />
        <Route path="/logout" component={LockContainer} />
      <Route path="/settings" component={SettingsContainer} auth />**/}
    </Switch>
  </App>
);
