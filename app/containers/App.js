import React, { Component } from 'react';
import { ipcRenderer } from 'electron';

import NavigationBar from '../components/navigation/NavigationBar';
import styles from './App.css';
import Api from '../../lib/core-api-client/ApiV1';
import Socket0 from '../../lib/core-api-client/WebSocketWrapper';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      timestamp: 0,
      nodes: { gates: 0, timetables: 0 },
      audio: [],
      api: null,
      socket: null
    };

    ipcRenderer.on('audio', this.handleSetAudio);
    // After config recieving we should fetch the data and render markup.
    ipcRenderer.on('config', this.handleConfig);
  }

  getNodes = () => {
    this.state.api
      .fetchNodes()
      .then(data => this.setState({ nodes: data }))
      .catch();
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

  render() {
    if (this.state.api === null) {
      return <div>Init api.</div>;
    }

    const el = React.cloneElement(this.props.children, { api: this.state.api });

    return (
      <div className="pt-ui-text">
        <div className={styles.container}>
          <NavigationBar
            timestamp={this.state.timestamp}
            nodes={this.state.nodes}
            audio={this.state.audio}
          />
          <div className={styles.content}>
            {el}
          </div>
        </div>
      </div>
    );
  }
}
