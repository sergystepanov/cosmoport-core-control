import React, {Component} from 'react';
import Sound from 'react-sound';

import PlayerControls from './PlayerControls';
import SongSelector from './SongSelector';

const {app} = require('electron').remote;

export default class Player extends Component {
  constructor(props) {
    super(props);

    this.state = {
      track: 0,
      position: 0,
      volume: 20,
      // Played / Stoped
      playStatus: Sound.status.STOPPED
    };
  }

  render() {
    const {volume} = this.state;

    return (
      <div>
        <PlayerControls
          playStatus={this.state.playStatus}
          onNext={this.handleNext}
          onBack={this.handleBack}
          onPlay={() => this.setState({playStatus: Sound.status.PLAYING})}
          onPause={() => this.setState({playStatus: Sound.status.PAUSED})}
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
          duration={0}
          position={this.state.position}/> {this.hasTrack() && <Sound
          url={this.buildUrl(this.getTrack(this.state.track))}
          playStatus={this.state.playStatus}
          playFromPosition={this.state.position}
          volume={this.state.volume}
          onLoading={({bytesLoaded, bytesTotal}) => console.log(`${bytesLoaded / bytesTotal * 100}% loaded`)}
          onPlaying={({position}) => console.log(position)}
          onFinishedPlaying={this.handleFinish}/>}
        {this.renderCurrentSong()}
      </div>
    );
  }

  handleNext = () => {
    this.shiftPlayTrack(1);
  }

  handleBack= () => {
    this.shiftPlayTrack(-1);
  }

  buildUrl(file) {
    return `file:///${app.getPath('music')}/${file}`;
  }

  hasTrack() {
    return this.state.track > -1 && this.props.music.length > 0;
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
        return '(unknown)';
    }
  }

  getTrack(index) {
    return this.props.music[index];
  }

  shiftPlayTrack(shift) {
    const tracks = this.props.music;

    this.setState({
      track: (this.state.track + shift) % this.props.music.length,
      position: 0
    });
  }

  handleFinish = () => {
    // this.setState({playStatus: Sound.status.STOPPED})}
    this.shiftPlayTrack(1);
  }

  renderCurrentSong() {
    return (<span>{`Track ${this.getTrack(this.state.track)} is ${this.getStatus()}`}</span>);
  }
}
