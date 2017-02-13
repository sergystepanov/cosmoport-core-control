import React, {Component} from 'react';
import {Button, Intent} from '@blueprintjs/core';

class EventTableRow extends Component {
  constructor(props) {
    super(props);

    this.passClick = this
      .passClick
      .bind(this);
  }

  passClick(event) {
    this.props.callback(event.target.getAttribute('data-row-id'));
  }

  renderTypeCol(val, values) {
    let result = val;

    for (let type of values.types) {
      if (val === type.id) {
        result = `${type.eventTypeName}/${type.eventTypeSubname}`;
        break;
      }
    }

    return result;
  }

  renderDestCol(val, values) {
    let result = val;

    for (let dest of values.destinations) {
      if (val === dest.id) {
        result = dest.eventDestinationName;
        break;
      }
    }

    return result;
  }

  renderStatusCol(val, values) {
    let result = val;

    for (let status of values.statuses) {
      if (val === status.id) {
        result = status.status;
        break;
      }
    }

    return result;
  }

  render() {
    var name = this.props.event.status === 'inactive'
      ? 'canceled'
      : '';

    let myAttr = {
      'data-row-id': this.props.event.id
    };

    return (
      <tr className={name}>
        <td>{this.props.event.startTime}</td>
        <td>
          <span className="type-name">
          {this.renderTypeCol(this.props.event.eventTypeId, this.props.refs)}
          </span>
          {this.props.event.type}
        </td>
        <td>{this.renderDestCol(this.props.event.eventDestinationId, this.props.refs)}</td>
        <td>{this.props.event.cost}
          €</td>
        <td>{this.props.event.durationTime} min</td>
        <td>{this.renderStatusCol(this.props.event.eventStatusId, this.props.refs)}</td>
        <td><Button
          className="pt-minimal"
          iconName="remove"
          {...myAttr}
          onClick={this.passClick}
          /></td>
      </tr>
    );
  }
}

export default EventTableRow;
