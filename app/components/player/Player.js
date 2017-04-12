import React, { Component, PropTypes } from 'react';
import Sound from 'react-sound';

import PlayerControls from './PlayerControls';

import styles from './Player.css';

const { app } = require('electron').remote;

const shrink = (text, length) => `${text.substring(0, length)}...${text.substring(text.length - length)}`;
const buildUrl = (file) => `file:///${app.getPath('music')}/${file}`;

export default class Player extends Component {
  static propTypes = {
    music: PropTypes.arrayOf(PropTypes.string)
  }

  static defaultProps = {
    music: []
  }

  constructor(props) {
    super(props);

    this.state = {
      track: '',
      position: 0,
      volume: 20,
      // Played / Stoped
      playStatus: Sound.status.STOPPED
    };

    this.candidates = [];
  }

  componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
      this.candidates = nextProps.music.slice(0);
      this.randomTrack();
    }
  }

  getStatus = () => {
    switch (this.state.playStatus) {
      case Sound.status.PLAYING:
        return 'playing';
      case Sound.status.PAUSED:
        return 'paused';
      case Sound.status.STOPPED:
        return 'stopped';
      default:
        return '(unknown)';
    }
  }

  randomTrack = () => {
    // reload tracks
    if (this.candidates.length === 0) {
      this.candidates = this.props.music.slice(0);
    }

    const name = this.candidates.splice(Math.floor(Math.random() * this.candidates.length), 1);

    this.setState({ track: name, position: 0 });
  }

  render() {
    const { volume, playStatus, position, track } = this.state;
    const hasTrack = track !== '' && this.props.music.length > 0;

    return (
      <div className={styles.centred}>
        <PlayerControls
          playStatus={playStatus}
          onNext={this.randomTrack}
          onPlay={() => this.setState({ playStatus: Sound.status.PLAYING })}
          onPause={() => this.setState({ playStatus: Sound.status.PAUSED })}
          onStop={() => this.setState({ playStatus: Sound.status.STOPPED, position: 0 })}
          onSeek={pos => this.setState({ pos })}
          onVolumeUp={() => this.setState({ volume: volume >= 100 ? volume : volume + 10 })}
          onVolumeDown={() => this.setState({ volume: volume <= 0 ? volume : volume - 10 })}
          duration={0}
          position={position}
        />
        {hasTrack && <Sound
          url={buildUrl(track)}
          playStatus={playStatus}
          playFromPosition={position}
          volume={volume}
          onFinishedPlaying={this.randomTrack}
        />}
        {hasTrack && <div title={track} className={`${styles.centred} ${styles.player}`}>
          {shrink(`Track ${track} is ${this.getStatus()}`, 15)}
        </div>}
      </div>
    );
  }
}
