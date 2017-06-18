import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Sound from 'react-sound';

const { app } = require('electron').remote;

const buildUrl = (file) => `file:///${app.getPath('music')}/events/${file}`;

export default class Announcer extends Component {
  static propTypes = {
    announcements: PropTypes.arrayOf(PropTypes.string),
    onAnnouncementEnd: PropTypes.func
  }

  static defaultProps = {
    announcements: [],
    onAnnouncementEnd: () => { }
  }

  constructor(props) {
    super(props);

    this.state = {
      active: false,
      playStatus: Sound.status.PLAYING
    };
  }

  handleTrackFinish = () => {
    this.props.onAnnouncementEnd();

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
    const { announcements } = this.props;
    const { playStatus } = this.state;
    const hasAnnouncements = announcements.length > 0;

    if (!hasAnnouncements) {
      return null;
    }

    return (<Sound
      url={buildUrl(`${announcements[0]}.mp3`)}
      playStatus={playStatus}
      playFromPosition={0}
      volume={30}
      onFinishedPlaying={this.handleTrackFinish}
    />);
  }
}
