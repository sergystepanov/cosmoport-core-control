import React, {PropTypes, Component} from 'react';
import {Button} from '@blueprintjs/core';

export default class EventTableRow extends Component {
  static propTypes = {
    callback: PropTypes.func.isRequired,
    event: PropTypes
      .shape({
      id: PropTypes.number.isRequired,
      contestants: PropTypes.number.isRequired,
      cost: PropTypes.number.isRequired,
      dateAdded: PropTypes.string.isRequired,
      durationTime: PropTypes.number.isRequired,
      eventDate: PropTypes.string.isRequired,
      eventDestinationId: PropTypes.number.isRequired,
      eventStatusId: PropTypes.number.isRequired,
      eventTypeId: PropTypes.number.isRequired,
      gateId: PropTypes.number.isRequired,
      peopleLimit: PropTypes.number.isRequired,
      repeatInterval: PropTypes.number.isRequired,
      startTime: PropTypes.number.isRequired
    })
      .isRequired,
    refs: PropTypes.shape({
      destinations: PropTypes.arrayOf(PropTypes.shape({id: PropTypes.number.isRequired, i18nEventDestinationName: PropTypes.number.isRequired})),
      statuses: PropTypes
        .arrayOf(PropTypes.shape({id: PropTypes.number.isRequired, i18nStatus: PropTypes.number.isRequired}))
        .isRequired,
      types: PropTypes
        .arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        defaultDuration: PropTypes.number.isRequired,
        defaultRepeatInterval: PropTypes.number.isRequired,
        i18nEventTypeDescription: PropTypes.number.isRequired,
        i18nEventTypeName: PropTypes.number.isRequired,
        i18nEventTypeSubname: PropTypes.number.isRequired
      }))
        .isRequired
    }).isRequired
  }

  static defaultProps = {
    callback: () => {}
  }

  passClick = (event) => {
    this
      .props
      .callback(event.target.getAttribute('data-row-id'));
  }

  renderTypeCol(val, values) {
    let result = val;

    console.log('sza');

    for (let type of values.types) {
      if (val === type.id) {
        result = `${type.i18nEventTypeName}/${type.i18nEventTypeSubname}`;
        break;
      }
    }

    return result;
  }

  renderDestCol(val, values) {
    let result = val;

    for (let dest of values.destinations) {
      if (val === dest.id) {
        result = dest.i18nEventDestinationName;
        break;
      }
    }

    return result;
  }

  renderStatusCol(val, values) {
    let result = val;

    for (let status of values.statuses) {
      if (val === status.id) {
        result = status.i18nStatus;
        break;
      }
    }

    return result;
  }

  minutesToHm(minutes) {
    if (minutes < 0) {
      return '00:00';
    }

    const h = Math.trunc(minutes / 60);
    const m = minutes % 60;

    return `${h < 10
      ? '0' + h
      : h}:${m < 10
        ? '0' + m
        : m}`;
  }

  render() {
    const name = this.props.event.status === 'inactive'
      ? 'canceled'
      : '';

    let myAttr = {
      'data-row-id': this.props.event.id
    };

    return (
      <tr className={name}>
        <td>{this.minutesToHm(this.props.event.startTime)}</td>
        <td>
          <span className="type-name">
            {this.renderTypeCol(this.props.event.eventTypeId, this.props.refs)}
          </span>
          {this.props.event.type}
        </td>
        <td>{this.renderDestCol(this.props.event.eventDestinationId, this.props.refs)}</td>
        <td>{this.props.event.cost}
          €</td>
        <td>{this.props.event.durationTime}
          min</td>
        <td>{this.renderStatusCol(this.props.event.eventStatusId, this.props.refs)}</td>
        <td><Button
          className="pt-minimal"
          iconName="remove"
          {...myAttr}
          onClick={this.passClick}/></td>
      </tr>
    );
  }
}
