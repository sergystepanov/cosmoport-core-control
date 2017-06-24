import React, { Component } from 'react';
import PropTypes from 'prop-types';

import EventPropType from '../../../props/EventPropType';
import Action from '../action/Action';
import { eventStatus } from '../../../../lib/core-api-client/ApiV1';
import _date from '../../date/_date';

/**
 * A client-side Cosmoport activity simulation.
 *
 * Uses internal timer.
 *
 * @version 0.0.0
 */
export default class Simulator extends Component {
  static propTypes = {
    events: PropTypes.arrayOf(EventPropType),
    // Wether or not to activate the simulator
    active: PropTypes.bool,
    // A number of minutes for action calculations before the events
    precedeTime: PropTypes.number,
    onStatusChange: PropTypes.func,
    onAnnouncement: PropTypes.func,
    onTurnGateOn: PropTypes.func,
    onArchive: PropTypes.func,
    onReturn: PropTypes.func,
    onSimulationTick: PropTypes.func,
    onNewDay: PropTypes.func
  }

  static defaultProps = {
    events: [],
    active: false,
    precedeTime: 10,
    onStatusChange: () => { },
    onAnnouncement: () => { },
    onTurnGateOn: () => { },
    onArchive: () => { },
    onReturn: () => { },
    onSimulationTick: () => { },
    onNewDay: () => { }
  }

  constructor(props) {
    super(props);

    this.state = {
      active: props.active,
      actions: [],
      // The seconds relative to the current time in which the simulation should update its state
      simulationTickResolution: 60,
      ticks: 0,
      times: {
        precede: 10,
        archive: 10
      }
    };

    // An internal timer
    this.timer = null;
  }

  componentDidMount() {
    this.timer = setInterval(() => this.update(), 1000);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.events !== nextProps.events) {
      this.setState({ actions: this.scheduleActions(nextProps.events) });
    }

    if (this.props.precedeTime !== nextProps.precedeTime) {
      this.setState({ precedeTime: nextProps.precedeTime });
    }

    if (this.props.active !== nextProps.active) {
      this.setState({ active: nextProps.active }, () => {
        this.props.onSimulationTick(this.state);
      });
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  update = () => {
    const date = new Date();

    if (this.isNewDay(date)) {
      this.props.onNewDay();
    }

    const inResolution = date.getSeconds() % this.state.simulationTickResolution === 0;
    if (!inResolution) {
      return;
    }

    this.tick(_date.toMinutes(date));
  }

  isNewDay = (date) => date.getMinutes() === 0 && date.getSeconds() === 0

  tick = (minutes) => {
    this.doActionsForMinute(minutes);
    this.setState({ ticks: this.state.ticks + 1 }, () => {
      // Push the state upwards
      this.props.onSimulationTick(this.state);
    });
  }

  scheduleActions = (events) => {
    const { times } = this.state;

    return events
      // Not a canceled even
      .filter(event => event.eventStatusId !== eventStatus.CANCELED)
      .map(event => this.eventsToActions(event, times.precede, times.archive))
      // flatten all actions into one dimensional array
      .reduce((acc, cur) => acc.concat(cur), [])
      // sort it by start time and action weight (time following order)
      .sort((a, b) => a.time - b.time || a.weight - b.weight);
  }

  eventsToActions = (event, pre, archive) => {
    const boardingTime = event.startTime - pre > 0 ? event.startTime - pre : 0;
    const eventTime = event.startTime;
    const returningTime = event.startTime + event.durationTime;
    const beforeReturnTime = returningTime - pre > 0 ? returningTime - pre : 0;
    const archiveTime = eventTime + archive;

    return [
      // set event status to boarding
      new Action(event, boardingTime, 'set_status_boarding', 1),
      // Gate? show the number
      // Play sound
      new Action(event, boardingTime, 'play_boarding_sound', 2),
      // Show gate
      new Action(event, boardingTime, 'turn_on_gate', 3),
      // set event status to departed
      new Action(event, eventTime, 'set_status_departed', 4),
      // Play sound
      new Action(event, eventTime, 'play_departed_sound', 5),
      // archive event
      new Action(event, archiveTime, 'archive', 6),
      new Action(event, beforeReturnTime, 'show_return', 7),
      new Action(event, returningTime, 'set_status_returned', 8)
    ];
  }

  mapActionToReaction = (action) => ({
    set_status_boarding: 'handleSetStatus',
    play_boarding_sound: 'handleAnnouncement',
    turn_on_gate: 'handleGateTurning',
    set_status_departed: 'handleSetStatus',
    play_departed_sound: 'handleAnnouncement',
    archive: 'handleArchive',
    show_return: 'handleReturn',
    set_status_returned: 'handleSetStatus'
  }[action.do])

  doActionsForMinute = (minute) => {
    this.state.actions
      .filter(a => a.time === minute)
      .forEach(a => {
        this.doIt(a);
      });
  }

  doIt = (action) => this[this.mapActionToReaction(action)](action)

  handleSetStatus = (action) => this.props.onStatusChange(action)

  handleAnnouncement = (action) => {
    const announcement = {
      id: action.event.id,
      time: new Date().getTime(),
      type: { play_boarding_sound: 'boarding', play_departed_sound: 'departure' }[action.do]
    };

    this.props.onAnnouncement(announcement);
  }

  handleGateTurning = (action) => this.props.onTurnGateOn(action)

  handleArchive = (action) => this.props.onArchive(action)

  handleReturn = (action) => this.props.onReturn(action)

  render = () => <span />
}
