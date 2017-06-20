import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@blueprintjs/core';

import EventPropType from '../../props/EventPropType';
import _date from '../date/_date';
import GateSchedule from './schedule/GateSchedule';

import styles from '../../components/simulator/Simulator.css';

export default class SimulacraControl extends Component {
  static propTypes = {
    onStatusChange: PropTypes.func,
    onAnnouncement: PropTypes.func,
    onTurnGateOn: PropTypes.func,
    onArchive: PropTypes.func,
    onReturn: PropTypes.func,
    actions: PropTypes.arrayOf(PropTypes.shape({
      event: EventPropType,
      time: PropTypes.number,
      do: PropTypes.string
    })),
    events: PropTypes.arrayOf(EventPropType),
    simulacra: PropTypes.shape({ ticks: PropTypes.number })
  }

  static defaultProps = {
    onStatusChange: () => { },
    onAnnouncement: () => { },
    onTurnGateOn: () => { },
    onArchive: () => { },
    onReturn: () => { },
    actions: [],
    events: [],
    simulacra: { ticks: 0 }
  }

  mapActionReaction = (action) => ({
    set_status_boarding: 'handleSetStatus',
    play_boarding_sound: 'handleAnnouncement',
    turn_on_gate: 'handleGateTurning',
    set_status_departed: 'handleSetStatus',
    play_departed_sound: 'handleAnnouncement',
    archive: 'handleArchive',
    show_return: 'handleReturn',
    set_status_returned: 'handleSetStatus'
  }[action.do])

  handleActionClick = (action) => this[this.mapActionReaction(action)](action)

  handleSetStatus = (action) => this.props.onStatusChange(action)

  handleAnnouncement = (action) => this.props.onAnnouncement({ play_boarding_sound: 'boarding', play_departed_sound: 'departure' }[action.do])

  handleGateTurning = (action) => this.props.onTurnGateOn(action)

  handleArchive = (action) => this.props.onArchive(action)

  handleReturn = (action) => this.props.onReturn(action)

  render() {
    const currentMinutes = _date.toMinutes(new Date());
    const events = this.props.actions.map(
      action => {
        let destination = '';
        if (action.do === 'turn_on_gate') {
          destination = `(G${action.event.gateId}) `;
        } else if (action.do === 'show_return') {
          destination = `(G${action.event.gate2Id}) `;
        }

        return (<div className={`pt-minimal ${action.time < currentMinutes ? styles.done : ''}`} key={`${action.event.id}_${action.time}_${action.do}`}>
          {_date.minutesToHm(action.time)} → {destination}<Button className={`pt-minimal ${action.time < currentMinutes ? styles.done : ''}`} text={action.do} onClick={this.handleActionClick.bind(this, action)} />
        </div>);
      });

    return (
      <div>
        <span className="pt-icon-heart">{this.props.simulacra.ticks > 0 && this.props.simulacra.ticks}</span>
        <div>
          <GateSchedule events={this.props.events} />
        </div>
        <div>
          {events}
        </div>
      </div>
    );
  }
}
