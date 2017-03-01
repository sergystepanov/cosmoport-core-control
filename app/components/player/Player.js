import React, {Component} from 'react';
import Sound from 'react-sound';

import PlayerControls from './PlayerControls';
import SongSelector from './SongSelector';

const {app} = require('electron').remote;
// var userDataPath = app.getPath('userData');

export default class Player extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentSong: '',
      position: 0,
      volume: 30,
      playStatus: Sound.status.PLAYING
    };
  }

  render() {
    const {volume} = this.state;

    return (
      <div>
        <SongSelector
          music={this.props.music}
          selectedSong={this.state.currentSong}
          onSongSelected={this.handleSongSelected}/> {this.state.currentSong && this.renderCurrentSong()}
        <PlayerControls
          playStatus={this.state.playStatus}
          onPlay={() => this.setState({playStatus: Sound.status.PLAYING})}
          onPause={() => this.setState({playStatus: Sound.status.PAUSED})}
          onResume={() => this.setState({playStatus: Sound.status.PLAYING})}
          onStop={() => this.setState({playStatus: Sound.status.STOPPED, position: 0})}
          onSeek={position => this.setState({position})}
          onVolumeUp={() => this.setState({
          volume: volume >= 100
            ? volume
            : volume + 10
        })}
          onVolumeDown={() => this.setState({
          volume: volume <= 0
            ? volume
            : volume - 10
        })}
          duration={this.state.currentSong
          ? 0
          : 0}
          position={this.state.position}/> {this.state.currentSong && <Sound
          url={this.buildUrl(this.state.currentSong)}
          playStatus={this.state.playStatus}
          playFromPosition={this.state.position}
          volume={volume}
          onLoading={({bytesLoaded, bytesTotal}) => console.log(`${bytesLoaded / bytesTotal * 100}% loaded`)}
          onPlaying={({position}) => console.log(position)}
          onFinishedPlaying={() => this.setState({playStatus: Sound.status.STOPPED})}/>}
      </div>
    );
  }

  buildUrl(file) {
    const url = `file:///${app.getPath('music')}/${file}`;

    return url;
  }

  getStatus() {
    switch (this.state.playStatus) {
      case Sound.status.PLAYING:
        return 'playing';
      case Sound.status.PAUSED:
        return 'paused';
      case Sound.status.STOPPED:
        return 'stopped';
      default:
        return '(unknown)'
    }
  }

  renderCurrentSong() {
    return (
      <p>
        `Track ${this.state.currentSong}
        is ${this.getStatus()}`
      </p>
    );
  }

  handleSongSelected = (song) => {
    this.setState({currentSong: song, position: 0});
  }
}
