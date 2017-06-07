import React, { Component } from 'react';
import { ipcRenderer } from 'electron';

import NavigationBar from '../components/navigation/NavigationBar';
import styles from './App.css';
import Api from '../../lib/core-api-client/ApiV1';
import Socket0 from '../../lib/core-api-client/WebSocketWrapper';
import Rupor from '../components/player/Announcer';
import ApiError from '../components/indicators/ApiError';
import Message from '../components/messages/Message';

export default class App extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      timestamp: 0,
      nodes: { gates: 0, timetables: 0 },
      audio: [],
      announcments: [],
      api: null,
      socket: null,
      simulation: {
        ticks: 0
      },
      auth: false
    };

    ipcRenderer.on('audio', this.handleSetAudio);
    // After config recieving we should fetch the data and render markup.
    ipcRenderer.on('config', this.handleConfig);
  }

  componentDidMount() {
    this.simulacraTimerId = setInterval(() => this.tick(), 1000 * 30);
  }

  componentWillUnmount() {
    clearInterval(this.simulacraTimerId);
  }

  getNodes = () => {
    this.state.api
      .fetchNodes()
      .then(data => this.setState({ nodes: data }))
      .catch();
  }

  tick = () => {
    // this.setState({});
    console.info('[simulacra] tick');
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
          self.getNodes();
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

    this.setState({
      api: new Api(`http://${config.address.server}`),
      socket: socket0
    },
      () => {
        this.state.api
          .fetchTime()
          .then(data => this.setState({ timestamp: data.timestamp }))
          .catch();

        this.getNodes();
      });
  }

  handleAnnouncment = (name) => {
    this.setState({ announcments: this.state.announcments.concat([name]) });
    console.info('announcment', name);
  }

  handleAnnouncmentEnd = () => {
    const anns = this.state.announcments;
    if (anns.length > 0) {
      this.removeEndedAnoncment();
    }
  }

  removeEndedAnoncment = () => {
    this.setState((prevState) => ({
      announcments: prevState.announcments.filter((_, i) => i !== 0)
    }));
  }

  handlePassword = (pass) => {
    this.state.api
      .authWith({ pwd: pass })
      .then(response => {
        if (response.result) {
          this.setState({ auth: true });
          Message.show('Access was granted.');
        }

        return 1;
      })
      .catch(error => ApiError(error));
  }

  handleLogout = () => {
    this.setState({ auth: false });
    Message.show('Access was revoked.');
  }

  render() {
    const { auth, api } = this.state;

    if (api === null) {
      return <div>Loading...</div>;
    }

    if (!auth) {
      
    }

    const el = React.cloneElement(
      this.props.children,
      {
        api: this.state.api,
        simulation: this.state.simulation,
        simulation_announcments: this.state.announcments,
        auth: this.state.auth,
        onAnnouncment: this.handleAnnouncment,
        onAuth: this.handlePassword,
        onDeAuth: this.handleLogout
      }
    );

    return (
      <div>
        <Rupor announcments={this.state.announcments} onAnnouncmentEnd={this.handleAnnouncmentEnd} />
        <div className="pt-ui-text">
          <div className={styles.container}>
            <NavigationBar
              timestamp={this.state.timestamp}
              nodes={this.state.nodes}
              audio={this.state.audio}
              authed={this.state.auth}
            />
            <div className={styles.content}>
              {el}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
