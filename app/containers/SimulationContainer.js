import React, { Component, PropTypes } from 'react';

import Api from '../../lib/core-api-client/ApiV1';
import PageCaption from '../components/page/PageCaption';
import SimulacraControl from '../components/simulator/SimulacraControl';
import Simulacra0 from '../components/simulator/Simulacra';
import ApiError from '../components/indicators/ApiError';
import EventMapper from '../components/mapper/EventMapper';
import Message from '../components/messages/Message';

export default class SimulationContainer extends Component {
  static propTypes = {
    api: PropTypes.instanceOf(Api),
  }

  static defaultProps = {
    api: null
  }

  constructor(props) {
    super(props);

    this.state = {
      actions: []
    };
  }

  componentDidMount() {
    const start = new Date().getTime();
    this.props.api.fetchEvents()
      .then(data => {
        const acts = new Simulacra0().actions(data);
        this.setState({ actions: acts });
        console.info('time', (new Date().getTime() - start));
      })
      .catch(error => console.log(error));
  }

  handleTurnGateOn = (action) => {
    console.info('gateOn', action);
    this.fireUpTheGate(action.event, 'before_departion');
  }

  handleArchive = (action) => {
    console.info('archive', action);
  }

  handleReturn = (action) => {
    console.info('return', action);
    this.setEventStatus(action.event, action);
    this.fireUpTheGate(action.event, 'before_return');
  }

  handleStatusChange = (action) => {
    console.info('status', action);

    this.setEventStatus(action.event, action);
  }

  setEventStatus = (event, action) => {
    // Be careful with these hardcoded values
    const statusIdMap =
      { show_return: 6, set_status_boarding: 4, set_status_departed: 5 }[action.do];

    let ev = event;
    ev.eventStatusId = statusIdMap;
    const modifiedEvent = EventMapper.unmap(ev);

    this.props.api
      .updateEvent(modifiedEvent)
      .then(result => Message.show(`Event status has been updated [${result.id}].`))
      // .then(() => this.handleRefresh())
      .catch(error => ApiError(error));
  }

  fireUpTheGate = (evt, tpy) => {
    this.props.api
      .proxy({ name: 'fire_gate', event: evt, type: tpy })
      .then(() => Message.show(`Firing up the Gate #${evt.gateId}.`))
      .catch(error => ApiError(error));
  }

  render() {
    const announcments = this.props.simulation_announcments.length > 0 ? this.props.simulation_announcments.map((a, i) => <div key={a + i}>{`${i + 1} - ${a}`}</div>) : <div>Empty</div>;

    return (
      <div>
        <PageCaption text="02 Simulation (WIP)" />
        <div className="pt-callout">
          Here you can run the system simulation.
          Be aware it will change statuses of events.
        </div>
        <div>
          <div>
            Queue for announcements:
          {announcments}
          </div>
        </div>
        <SimulacraControl
          actions={this.state.actions}
          simulacra={this.props.simulation}
          onAnnouncment={this.props.onAnnouncment}
          onTurnGateOn={this.handleTurnGateOn}
          onArchive={this.handleArchive}
          onReturn={this.handleReturn}
          onStatusChange={this.handleStatusChange}
        />
      </div>
    );
  }
}
