import React, {PropTypes, Component} from 'react';
import {Button} from '@blueprintjs/core';

import EventPropType from '../../props/EventPropType';
import EventTypePropType from '../../props/EventTypePropType';
import EventDestinationPropType from '../../props/EventDestinationPropType';
import EventStatusPropType from '../../props/EventStatusPropType';
import LocalePropType from '../../props/LocalePropType';

import L18n from '../l18n/L18n';

/*
 * The class for rendering event table row.
 *
 * @since 0.1.0
 */
export default class EventTableRow extends Component {
  static propTypes = {
    callback: PropTypes.func.isRequired,
    event: EventPropType.isRequired,
    refs: PropTypes
      .shape({
      destinations: PropTypes
        .arrayOf(EventDestinationPropType)
        .isRequired,
      statuses: PropTypes
        .arrayOf(EventStatusPropType)
        .isRequired,
      types: PropTypes
        .arrayOf(EventTypePropType)
        .isRequired
    })
      .isRequired,
    locale: LocalePropType.isRequired
  }

  static defaultProps = {
    callback: () => {}
  }

  /**
   * Converts the number of minutes into hh:mm format.
   *
   * @param {number} minutes
   */
  static minutesToHm(minutes) {
    if (minutes < 1) {
      return '00:00';
    }

    const h = Math.trunc(minutes / 60);
    const m = minutes % 60;

    return `${h < 10
      ? `0${h}`
      : h}:${m < 10
        ? `0${m}`
        : m}`;
  }

  constructor(props) {
    super(props);

    this.l18n = new L18n(this.props.locale, this.props.refs);
  }

  /**
   * Passes on click event the row id to the parent using its callback.
   */
  passClick = (event) => {
    this
      .props
      .callback(event.target.getAttribute('data-row-id'));
  }

  /**
   * Renders the type column.
   *
   * @param {number} id
   * @param {Array} types @see EventTypePropType
   */
  renderTypeCol(id, types) {
    const type = types.find(type_ => type_.id === id);

    return type
      ? `${this
        .l18n
        .findTranslationById(type, 'i18nEventTypeName')} / ${this
        .l18n
        .findTranslationById(type, 'i18nEventTypeSubname')}`
      : id;
  }

  /**
   * Renders the destination column.
   *
   * @param {number} id
   * @param {Array} destinations @see EventDestinationPropType
   */
  renderDestCol(id, destinations) {
    const destination = destinations.find(destination_ => destination_.id === id);

    return destination
      ? this
        .l18n
        .findTranslationById(destination, 'i18nEventDestinationName')
      : id;
  }

  /**
   * Renders the status column.
   *
   * @param {number} id
   * @param {Array} statuses
   */
  renderStatusCol(id, statuses) {
    const status = statuses.find(status_ => status_.id === id);

    return status
      ? this
        .l18n
        .findTranslationById(status, 'i18nStatus')
      : id;
  }

  render() {
    const name = this.props.event.status === 'inactive'
      ? 'canceled'
      : '';

    // An attribute to store the row id
    const myAttr = {
      'data-row-id': this.props.event.id
    };

    return (
      <tr className={name}>
        <td>{`${this
            .props
            .event
            .eventDate}
          ${this
            .constructor
            .minutesToHm(this.props.event.startTime)}`}</td>
        <td>
          <span className="type-name">
            {this.renderTypeCol(this.props.event.eventTypeId, this.props.refs.types)}
          </span>
          {this.props.event.type}
        </td>
        <td>{this.renderDestCol(this.props.event.eventDestinationId, this.props.refs.destinations)}</td>
        <td>{`${this.props.event.cost} €`}</td>
        <td>{`${this.props.event.durationTime} min`}</td>
        <td>{this.renderStatusCol(this.props.event.eventStatusId, this.props.refs.statuses)}</td>
        <td>{`${this.props.event.contestants}/${this.props.event.peopleLimit}`}</td>
        <td><Button
          className="pt-minimal"
          iconName="remove"
          {...myAttr}
          onClick={this.passClick}/></td>
      </tr>
    );
  }
}
