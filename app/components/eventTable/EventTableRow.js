import React, { PropTypes, Component } from 'react';
import { Button } from '@blueprintjs/core';

import EventPropType from '../../props/EventPropType';
import EventTypePropType from '../../props/EventTypePropType';
import EventDestinationPropType from '../../props/EventDestinationPropType';
import EventStatusPropType from '../../props/EventStatusPropType';

import _date from '../date/_date';
import L18n from '../l18n/L18n';

/*
 * The class for rendering event table row.
 *
 * @since 0.1.0
 */
export default class EventTableRow extends Component {
  static propTypes = {
    callback: PropTypes.func,
    event: EventPropType,
    refs: PropTypes.shape({
      destinations: PropTypes.arrayOf(EventDestinationPropType),
      statuses: PropTypes.arrayOf(EventStatusPropType),
      types: PropTypes.arrayOf(EventTypePropType)
    }),
    l18n: PropTypes.instanceOf(L18n)
  }

  static defaultProps = {
    callback: () => { },
    event: {},
    refs: { destinations: [], statuses: [], types: [] },
    l18n: {}
  }

  /**
   * Passes on click event the row id to the parent using its callback.
   */
  passClick = (event) => this.props.callback(event.target.getAttribute('data-row-id'))


  renderL18nCell = (id, translations, custom) => {
    const l18nRecords = translations || [];
    const l18nId = l18nRecords.find(record => record.id === id);
    const l18n = this.props.l18n;

    return l18nId ? custom(l18nId, l18n) : id;
  }

  /**
   * Renders the type column.
   *
   * @param {number} id
   * @param {Array} types @see EventTypePropType
   */
  renderTypeCol = (id, types) => this.renderL18nCell(id, types, (l18nId, l18n) =>
    `${l18n.findTranslationById(l18nId, 'i18nEventTypeName')} / ${l18n.findTranslationById(l18nId, 'i18nEventTypeSubname')}`)

  /**
   * Renders the destination column.
   *
   * @param {number} id
   * @param {Array} destinations @see EventDestinationPropType
   */
  renderDestCol = (id, destinations) => this.renderL18nCell(id, destinations, (l18nId, l18n) =>
    l18n.findTranslationById(l18nId, 'i18nEventDestinationName'))

  /**
   * Renders the status column.
   *
   * @param {number} id
   * @param {Array} statuses
   */
  renderStatusCol = (id, statuses) => this.renderL18nCell(id, statuses, (l18nId, l18n) =>
    l18n.findTranslationById(status, 'i18nStatus'))

  render() {
    const { event, refs } = this.props;

    if (event === undefined || refs === undefined) {
      return null;
    }

    const name = event.status === 'inactive' ? 'canceled' : '';

    // An attribute to store the row id
    const myAttr = { 'data-row-id': event.id };

    return (
      <tr className={name} >
        <td>{`${event.eventDate}
          ${_date.minutesToHm(event.startTime)}`}</td>
        <td>
          <span className="type-name">
            {this.renderTypeCol(event.eventTypeId, refs.types)}
          </span>
          {event.type}
        </td>
        <td>{this.renderDestCol(event.eventDestinationId, refs.destinations)}</td>
        <td>{`${event.cost} €`}</td>
        <td>{`${event.durationTime} min`}</td>
        <td>{this.renderStatusCol(event.eventStatusId, refs.statuses)}</td>
        <td>{`${event.contestants}/${event.peopleLimit}`}</td>
        <td><Button className="pt-minimal" iconName="remove" {...myAttr} onClick={this.passClick} /></td>
      </tr >
    );
  }
}
