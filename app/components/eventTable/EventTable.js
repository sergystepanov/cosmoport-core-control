import React, { Component } from 'react';

import EventTableRow from './EventTableRow';
import L18n from '../l18n/L18n';

import styles from './EventTable.css';

export default class EventTable extends Component {
  handleRemove = (id) => this.props.callback(id)

  render() {
    const l18n = new L18n(this.props.locale, this.props.refs);
    const events = this.props.events.map(event => <EventTableRow
      key={event.id}
      event={event}
      refs={this.props.refs}
      l18n={l18n}
      callback={this.handleRemove}
    />);

    let result = null;

    if (events) {
      result = (
        <table className={`pt-table pt-striped ${styles.eventTable}`}>
          <thead>
            <tr>
              <th>Departure</th>
              <th>Type</th>
              <th>Gate</th>
              <th>Destination</th>
              <th>Cost</th>
              <th>Duration</th>
              <th>Status</th>
              <th>Tickets</th>
              <th title="It is `operations`">Ops</th>
            </tr>
          </thead>
          <tbody>{events}</tbody>
        </table>
      );
    } else {
      result = (
        <div className="pt-non-ideal-state">
          <div className="pt-non-ideal-state-visual pt-non-ideal-state-icon">
            <span className="pt-icon pt-icon-offline" />
          </div>
          <h4 className="pt-non-ideal-state-title">Nothing here</h4>
          <div className="pt-non-ideal-state-description">
            Create new event / reload data from the server.
          </div>
        </div>
      );
    }

    return result;
  }
}
