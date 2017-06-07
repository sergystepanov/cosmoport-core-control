import React from 'react';
import { render } from 'react-dom';
// import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';
// import { syncHistoryWithStore } from 'react-router-redux';
import routes from './routes';
// import configureStore from './store/configureStore';
import './app.global.css';

// const store = configureStore();
// const history = syncHistoryWithStore(hashHistory, store);
const history = hashHistory;

render(
  <Router history={history} routes={routes} />, document.getElementById('root')
);
