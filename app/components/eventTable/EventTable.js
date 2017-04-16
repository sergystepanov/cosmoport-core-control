import React, { Component } from 'react';

import EventTableRow from './EventTableRow';
import L18n from '../l18n/L18n';

import styles from './EventTable.css';

export default class EventTable extends Component {
  handleRemove = (id) => this.props.callback(id)

  render() {
    let rows = [];
    let i = 1;
    const l18n = new L18n(this.props.locale, this.props.refs);

    this.props.events
      .forEach(function (event) {
        rows.push(<EventTableRow
          event={event}
          refs={this.props.refs}
          l18n={l18n}
          key={i}
          callback={this.handleRemove}
        />);
        i++;
      }, this);

    let result = null;

    if (rows.length > 0) {
      result = (
        <table className={`pt-table pt-striped ${styles.eventTable}`}>
          <thead>
            <tr>
              <th>Departure</th>
              <th>Type</th>
              <th>Destination</th>
              <th>Cost</th>
              <th>Duration</th>
              <th>Status</th>
              <th>Tickets</th>
              <th title="It is `operations`">Ops</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
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
