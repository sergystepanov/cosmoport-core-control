import React, { Component, PropTypes } from 'react';
import { DateInput } from '@blueprintjs/datetime';

import EventTypePropType from '../../props/EventTypePropType';
import EventDestinationPropType from '../../props/EventDestinationPropType';
import EventStatusPropType from '../../props/EventStatusPropType';
import LocalePropType from '../../props/LocalePropType';
import L18n from '../l18n/L18n';
import TimeFieldGroup from './group/TimeFieldGroup';
import ListFieldGroup from './group/ListFieldGroup';
import NumberFieldGroup from './group/NumberFieldGroup';

import styles from './EventForm.css';

/**
 * The class for event properties form.
 *
 * @since 0.1.0
 */
export default class EventForm extends Component {
  static propTypes = {
    refs: PropTypes.shape({
      destinations: PropTypes.arrayOf(EventDestinationPropType),
      statuses: PropTypes.arrayOf(EventStatusPropType),
      types: PropTypes.arrayOf(EventTypePropType)
    }).isRequired,
    locale: LocalePropType.isRequired
  }

  static defaultProps = { refs: { destinations: [], statuses: [], types: [] }, locale: {} }

  // TODO number inputs
  constructor(props) {
    super(props);

    this.l18n = new L18n(this.props.locale, this.props.refs);

    this.state = {
      // The day of the event
      date: new Date(),
      // Start minute of the event (in minutes)
      time: 0,
      // Duration of the event (in minutes)
      duration: 30,
      limit: 1,
      bought: 0,
      type: 0,
      destination: 0,
      gate: 0,
      status: 1,
      cost: 1
    };

    this.validators = {
      time: () => (this.state.time >= this.state.duration ? 'Start time should be less than end.' : ''),
      duration: () => (this.state.time + this.state.duration >= 24 * 60 ? 'End time should be less than 24.' : ''),
      type: () => (this.state.type === 0 ? 'Type is not selected.' : ''),
      status: () => (this.state.status === 0 ? 'Status is not selected.' : ''),
      gate: () => (this.state.gate === 0 ? 'Gate is not selected.' : ''),
      destination: () => (this.state.destination === 0 ? 'Destination is not selected.' : ''),
      bought: () => (this.state.bought > this.state.limit ? 'Beyond the tickets limit.' : '')
    };
  }

  /**
   * Returns all form's field mapped values.
   *
   * @return {Object} The form field values.
   * @since 0.1.0
   */
  getFormData = () => Object.assign(this.state, { valid: this.isValid() });

  handleChangeEvent = (event) => {
    this.handleChange(event.target.name, event.target.value);
  }

  handleChange = (name, value) => {
    this.setState({ [name]: value });
  }

  /**
   * Handles the change event on an input field of <day> type.
   *
   * @param {Date} day The date value.
   *
   * @since 0.1.0
   */
  handleDayChange = (day) => {
    // It can be null if user selects same date - skip the state change in that case
    if (day) {
      this.setState({ date: day });
    }
  }

  /**
   * Returns all form validators' call result.
   * It will return false on a first validation with a negative result (which has a message).
   *
   * @return {boolean} The result of validation.
   * @since 0.1.0
   */
  isValid = () => !Object.keys(this.validators).some(key => this.validators[key]() !== '')

  render() {
    const statuses = this.props.refs.statuses.map(status =>
      <option key={status.id} value={status.id}>
        {this.l18n.findTranslationById(status, 'i18nStatus')}
      </option>
    );
    const destinations = this.props.refs.destinations.map(destination =>
      <option key={destination.id} value={destination.id}>
        {this.l18n.findTranslationById(destination, 'i18nEventDestinationName')}
      </option>
    );
    const types = this.props.refs.types.map(type =>
      <option key={type.id} value={type.id}>
        {this.l18n.findTranslationById(type, 'i18nEventTypeName')}&nbsp;/&nbsp;{this.l18n.findTranslationById(type, 'i18nEventTypeSubname')}
      </option>
    );
    const { time, duration, type, status, destination, gate, bought } = this.validators;

    return (
      <div>
        <label htmlFor="day" className="pt-label pt-inline">
          <span className={styles.label_text}>Day</span>
          <DateInput id="day" value={this.state.date} showActionsBar onChange={this.handleDayChange} />
        </label>

        <ListFieldGroup name="type" index={this.state.type} validation={type()} onChange={this.handleChange}>
          {types}
        </ListFieldGroup>

        <div className="form-time-range">
          <TimeFieldGroup
            name="time"
            caption="Start"
            minutes={this.state.time}
            onChange={this.handleChange}
            validation={time()}
          />
          <TimeFieldGroup
            name="duration"
            caption="End"
            minutes={this.state.duration}
            onChange={this.handleChange}
            validation={duration()}
          />
        </div>

        <ListFieldGroup name="status" index={this.state.status} validation={status()} onChange={this.handleChange}>
          {statuses}
        </ListFieldGroup>

        <ListFieldGroup name="gate" index={this.state.gate} validation={gate()} onChange={this.handleChange}>
          <option value="1">One</option>
          <option value="2">Two</option>
          <option value="3">Three</option>
          <option value="4">Four</option>
        </ListFieldGroup>

        <ListFieldGroup name="destination" index={this.state.destination} validation={destination()} onChange={this.handleChange}>
          {destinations}
        </ListFieldGroup>

        <NumberFieldGroup name="cost" number={this.state.cost} icon={'euro'} onChange={this.handleChange} />

        <NumberFieldGroup name="limit" number={this.state.limit} onChange={this.handleChange} />

        <NumberFieldGroup name="bought" number={this.state.bought} validation={bought()} onChange={this.handleChange} />
      </div>
    );
  }
}
