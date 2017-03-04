import React, {Component} from 'react';
import {Button} from '@blueprintjs/core';

export default class PlayerControls extends Component {
  render() {
    return (
      <div>
        <Button
          className="pt-minimal"
          iconName="step-backward"
          onClick={this.props.onBack}/>
        <Button
          className="pt-minimal"
          iconName="step-forward"
          onClick={this.props.onNext}/>
        <Button className="pt-minimal" iconName="play" onClick={this.props.onPlay}/>
        <Button className="pt-minimal" iconName="stop" onClick={this.props.onStop}/>
        <Button className="pt-minimal" iconName="pause" onClick={this.props.onPause}/>
        <Button
          className="pt-minimal"
          iconName="volume-down"
          onClick={this.props.onVolumeDown}/>
        <Button
          className="pt-minimal"
          iconName="volume-up"
          onClick={this.props.onVolumeUp}/>
      </div>
    );
  }
}
