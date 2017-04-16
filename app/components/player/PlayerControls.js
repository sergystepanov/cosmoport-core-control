import React, { Component, PropTypes } from 'react';
import { Button, NumericInput, Tooltip, Position, Intent } from '@blueprintjs/core';

import styles from './Player.css';

const nop = () => { };

export default class PlayerControls extends Component {
  static propTypes = {
    period: PropTypes.number,
    isPlaying: PropTypes.bool,
    onPeriodChange: PropTypes.func,
    onNext: PropTypes.func,
    onPlay: PropTypes.func,
    onStop: PropTypes.func,
    onPause: PropTypes.func,
    onVolumeDown: PropTypes.func,
    onVolumeUp: PropTypes.func
  }

  static defaultProps = {
    period: 0,
    isPlaying: false,
    onPeriodChange: nop,
    onNext: nop,
    onPlay: nop,
    onStop: nop,
    onPause: nop,
    onVolumeDown: nop,
    onVolumeUp: nop
  }

  handlePeriodChange = (value) => {
    this.props.onPeriodChange(value);
  }

  render() {
    return (
      <div className={styles.controls}>
        <div className={styles.periodBlock}>
          <Tooltip content="Here you can set a delay in minutes between tacks." position={Position.BOTTOM}>
            <NumericInput className={styles.number} buttonPosition="none" value={this.props.period} onValueChange={this.props.onPeriodChange} />
          </Tooltip>
          <span>m</span>
        </div>
        <Button className="pt-minimal" iconName="step-forward" onClick={this.props.onNext} />
        <Button className="pt-minimal" intent={this.props.isPlaying ? Intent.WARNING : Intent.NONE} iconName="play" onClick={this.props.onPlay} />
        <Button className="pt-minimal" iconName="stop" onClick={this.props.onStop} />
        <Button className="pt-minimal" iconName="pause" onClick={this.props.onPause} />
        <Button className="pt-minimal" iconName="volume-down" onClick={this.props.onVolumeDown} />
        <Button className="pt-minimal" iconName="volume-up" onClick={this.props.onVolumeUp} />
      </div>
    );
  }
}
