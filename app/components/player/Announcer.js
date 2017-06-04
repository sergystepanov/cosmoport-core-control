import React, { Component, PropTypes } from 'react';
import Sound from 'react-sound';

const { app } = require('electron').remote;

const buildUrl = (file) => `file:///${app.getPath('music')}/events/${file}`;

export default class Announcer extends Component {
  static propTypes = {
    announcments: PropTypes.arrayOf(PropTypes.string)
  }

  static defaultProps = {
    announcments: []
  }

  constructor(props) {
    super(props);

    this.state = {
      active: false,
      playStatus: Sound.status.PLAYING
    };
  }

  handleTrackFinish = () => {
    this.props.onAnnouncmentEnd();

    // if (this.state === Sound.status.STOPPED) {
    //   return;
    // }

    // // wait some time
    // this.setState({ playStatus: Sound.status.STOPPED, isWaiting: true }, () => {
    //   this.randomTrack();
    //   this.timeout = setTimeout(() => {
    //     this.setState({ playStatus: Sound.status.PLAYING, isWaiting: false });
    //   }, this.state.period * 1000 * 60);
    // });
  }

  render() {
    const { announcments } = this.props;
    const { playStatus } = this.state;
    const hasAnnouncments = announcments.length > 0;

    if (!hasAnnouncments) {
      return null;
    }

    return (<Sound
      url={buildUrl(`${announcments[0]}.mp3`)}
      playStatus={playStatus}
      playFromPosition={0}
      volume={30}
      onFinishedPlaying={this.handleTrackFinish}
    />);
  }
}
