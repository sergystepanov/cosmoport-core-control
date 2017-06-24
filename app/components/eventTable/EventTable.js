import React, { Component } from 'react';
import PropTypes from 'prop-types';

import RefsPropType from '../../props/RefsPropType';
import LocalePropType from '../../props/LocalePropType';
import EventPropType from '../../props/EventPropType';
import EventTableRow from './EventTableRow';
import L18n from '../l18n/L18n';

import styles from './EventTable.css';

export default class EventTable extends Component {
  static propTypes = {
    editCallback: PropTypes.func,
    callback: PropTypes.func,
    auth: PropTypes.bool,
    refs: RefsPropType.isRequired,
    locale: LocalePropType.isRequired,
    events: PropTypes.arrayOf(EventPropType)
  }

  static defaultProps = {
    editCallback: () => { },
    callback: () => { },
    auth: false,
    events: []
  }

  handleEdit = (event) => this.props.editCallback(event)

  handleRemove = (id) => this.props.callback(id)

  render() {
    const { locale, refs, events: events_ } = this.props;
    const l18n = new L18n(locale, refs);

    const events = events_.map(event => (<EventTableRow
      key={event.id}
      event={event}
      refs={this.props.refs}
      l18n={l18n}
      editCallback={this.handleEdit}
      callback={this.handleRemove}
      auth={this.props.auth}
    />));

    let result = null;

    if (events) {
      result = (
        <table className={`pt-table pt-striped ${styles.eventTable}`}>
          <thead>
            <tr>
              <th>Departure</th>
              <th>#</th>
              <th>Type</th>
              <th>Gates</th>
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
