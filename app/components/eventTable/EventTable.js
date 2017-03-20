import React, {Component} from 'react';

import EventTableRow from './EventTableRow';

import styles from './EventTable.css';

export default class EventTable extends Component {
  handleRemove = (id) => {
    this
      .props
      .callback(id);
  }

  render() {
    let rows = [];
    let i = 1;

    this
      .props
      .events
      .forEach(function (event) {
        rows.push(<EventTableRow
          event={event}
          refs={this.props.refs}
          locale={this.props.locale}
          key={i}
          callback={this.handleRemove}/>);
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
            <span className="pt-icon pt-icon-offline"/>
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
