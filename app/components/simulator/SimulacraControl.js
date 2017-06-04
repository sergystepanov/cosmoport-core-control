import React, { Component } from 'react';
import { Button } from '@blueprintjs/core';

import _date from '../date/_date';

import styles from '../../components/simulator/Simulator.css';

export default class SimulacraControl extends Component {
  mapActionReaction = (action) => ({
    set_status_boarding: 'handleSetStatus',
    play_boarding_sound: 'handleAnnouncement',
    turn_on_gate: 'handleGateTurning',
    set_status_departed: 'handleSetStatus',
    play_departed_sound: 'handleAnnouncement',
    archive: 'handleArchive',
    show_return: 'handleReturn'
  }[action.do])

  handleActionClick = (action) => this[this.mapActionReaction(action)](action)

  handleSetStatus = (action) => this.props.onStatusChange(action)

  handleAnnouncement = (action) => this.props.onAnnouncment({ play_boarding_sound: 'boarding', play_departed_sound: 'departure' }[action.do])

  handleGateTurning = (action) => this.props.onTurnGateOn(action)

  handleArchive = (action) => this.props.onArchive(action)

  handleReturn = (action) => this.props.onReturn(action)

  render() {
    const currentMinutes = _date.toMinutes(new Date());
    const events = this.props.actions.map(
      action => (<div className={`pt-minimal ${action.time < currentMinutes ? styles.done : ''}`} key={`${action.event.id}_${action.time}_${action.do}`}>
        {_date.minutesToHm(action.time)} → <Button className={`pt-minimal ${action.time < currentMinutes ? styles.done : ''}`} text={action.do} onClick={this.handleActionClick.bind(this, action)} />
      </div>));

    return (
      <div>
        <span className="pt-icon-heart">{this.props.simulacra.ticks > 0 && this.props.simulacra.ticks}</span>
        <div>
          {events}
        </div>
      </div>
    );
  }
}
