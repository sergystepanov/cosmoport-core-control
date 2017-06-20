// @flow
import React, { Component } from 'react';
import { ipcRenderer } from 'electron';
import {
  Route,
  Switch
} from 'react-router-dom';

import NavigationBar from '../components/navigation/NavigationBar';
import styles from './App.css';
import Api from '../../lib/core-api-client/ApiV1';
import Socket0 from '../../lib/core-api-client/WebSocketWrapper';
import Rupor from '../components/player/Announcer';
import ApiError from '../components/indicators/ApiError';
import Message from '../components/messages/Message';
import MainPage from '../containers/MainPage';
import Table from '../containers/TableContainer';
import Simulation from '../containers/SimulationContainer';
import Translation from '../containers/TranslationContainer';
import Settings from '../containers/SettingsContainer';
import Lock from '../containers/LockContainer';
import Unlock from '../containers/UnlockContainer';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      timestamp: 1,
      nodes: { gates: 0, timetables: 0 },
      audio: [],
      announcements: [],
      api: null,
      socket: null,
      simulation: {
        ticks: 0
      },
      auth: false
    };

    this.timers = {
      simulationTick: null
    };

    ipcRenderer.on('audio', this.handleSetAudio);
    // After receiving the config, we should fetch the data and render markup.
    ipcRenderer.on('config', this.handleConfig);
  }

  componentDidMount() {
    this.timers.simulationTick = setInterval(() => this.tick(), 1000 * 30);
  }

  componentWillUnmount() {
    Object.keys(this.timers).forEach(timer => clearInterval(this.timers[timer]));
  }

  tick = () => {
    this.setState({ simulation: { ticks: this.state.simulation.ticks + 1 } });
  }

  handleSetAudio = (event, files) => {
    this.setState({ audio: files });
  }

  handleConfig = (event, data) => {
    this.init(data);
  }

  init = (config) => {
    const self = this;
    const socket0 = new Socket0({
      url: `ws://${config.address.server}/events?id=control`,

      onopen() { },

      onmessage(...args) {
        const message = args[0].data;

        console.log(message);

        if (message === ':update-nodes:') {
          self.state.api.fetchNodes()
            .then(data => self.setState({ nodes: data }))
            .catch(error => console.error(error));
        }
      },

      onclose() {
        if (self.state.socket) {
          self.state.socket.close();
        }
      },

      onerror(...args) {
        console.error(args);
      }
    });
    const api0 = new Api(`http://${config.address.server}`);

    this.setState({ api: api0, socket: socket0 });

    Promise.all([api0.fetchTime(), api0.fetchNodes()])
      .then(data => this.setState({ timestamp: data[0].timestamp, nodes: data[1] }))
      .catch(error => console.error(error));
  }

  handleAnnouncement = (name) => {
    this.setState({ announcements: this.state.announcements.concat([name]) });
    console.info('announcement', name);
  }

  handleAnnouncementEnd = () => {
    if (this.state.announcements.length > 0) {
      // Remove last announcement
      this.setState((prevState) => ({
        announcements: prevState.announcements.filter((_, i) => i !== 0)
      }));
    }
  }

  handlePassword = (pass) => {
    this.state.api.authWith({ pwd: pass })
      .then(response => {
        if (response.result) {
          this.setState({ auth: true }, () => {
            Message.show('Access was granted.');
          });
        }

        return 1;
      })
      .catch(error => ApiError(error));
  }

  handleLogout = () => {
    this.setState({ auth: false }, () => {
      Message.show('Access was revoked.');
    });
  }

  render() {
    const {
      auth: auth_,
      api: api_,
      announcements,
      simulation: sim,
      timestamp,
      nodes,
      audio
    } = this.state;

    if (api_ === null) {
      return <div>Loading...</div>;
    }

    const commonProps = {
      api: api_,
      simulation: sim,
      simulation_announcements: announcements,
      auth: auth_,
      onAnnouncement: this.handleAnnouncement
    };

    return (
      <div>
        <Rupor announcements={announcements} onAnnouncementEnd={this.handleAnnouncementEnd} />
        <div className="pt-ui-text">
          <div className={styles.container}>
            <NavigationBar timestamp={timestamp} nodes={nodes} audio={audio} auth={auth_} />
            <div className={styles.content}>
              <Switch>
                <Route exact path="/" render={props => <MainPage {...props} {...commonProps} />} />
                <Route path="/simulation" render={props => <Simulation {...props} {...commonProps} />} />
                <Route path="/translation" render={props => <Translation {...props} {...commonProps} auth />} />
                <Route path="/table" render={props => <Table {...props} {...commonProps} />} />
                <Route path="/login" render={() => <Unlock onAuth={this.handlePassword} />} />
                <Route path="/logout" render={() => <Lock onDeAuth={this.handleLogout} />} />
                <Route path="/settings" render={props => <Settings {...props} {...commonProps} auth />} />
              </Switch>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
