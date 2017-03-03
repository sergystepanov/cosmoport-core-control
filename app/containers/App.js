// @flow
import React, {Component} from 'react';
import {ipcRenderer} from 'electron';

import NavigationBar from '../components/navigation/NavigationBar';
import styles from './App.css';
import ApiV1 from './ApiV11';
import WebSocketWrapper from '../../lib/core-api-client/WebSocketWrapper';
import Player from '../components/player/Player';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      timestamp: 0,
      nodes: {
        gates: 0,
        timetables: 0
      },
      audio: []
    };

    ipcRenderer.on('audio', this.handleSetAudio);

    this.api = new ApiV1();
  }

  componentDidMount() {
    this
      .api
      .fetchTime((data) => {
        this.setState({timestamp: data.timestamp});
      }, () => {});
    this.trySocket(this);
  }

  getNodes() {
    this
      .api
      .fetchNodes((data) => {
        this.setState({nodes: data});
      }, () => {});
  }

  handleSetAudio = (event, files) => {
    this.setState({audio: files});
  }

  trySocket = (self) => {
    let socket = new WebSocketWrapper({
      url: 'ws://127.0.0.1:8080/events?id=core-control',

      onopen() {
        //this.send('message', 'hi');
      },

      onmessage(...args) {
        console.log(args);

        if (args[0].data === ':update-nodes:') {
          self.getNodes();
        }
      },

      onclose() {
        socket = null;
        console.log("close");
      },

      onerror(...args) {
        console.log('error occured, oh no!');
        console.error(args);
      }
    });
  }

  props : {
    children: HTMLElemen
  };

  render() {
    return (
      <div className="pt-ui-text">
        <div className={styles.container}>
          <NavigationBar timestamp={this.state.timestamp} nodes={this.state.nodes}/>
          <Player music={this.state.audio}/>
          <div className={styles.content}>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}
