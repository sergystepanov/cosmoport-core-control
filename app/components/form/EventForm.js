import React, { Component, PropTypes } from 'react';
import { DateInput } from '@blueprintjs/datetime';

import EventTypePropType from '../../props/EventTypePropType';
import EventDestinationPropType from '../../props/EventDestinationPropType';
import EventStatusPropType from '../../props/EventStatusPropType';
import LocalePropType from '../../props/LocalePropType';
import L18n from '../l18n/L18n';
import TimeFieldGroup from './group/TimeFieldGroup';

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

  static defaultProps = {
    refs: {
      destinations: [],
      statuses: [],
      types: []
    },
    locale: {}
  }

  constructor(props) {
    super(props);

    this.l18n = new L18n(this.props.locale, this.props.refs);

    this.state = {
      // The event day date
      date: new Date(),
      // Start minute of the event
      time: 0,
      // Duration in minutes of the event
      duration: 30,
      limit: 1,
      bought: 0,
      type: 0,
      destination: 0,
      gate: 0,
      status: 1,
      cost: 1
    };
  }

  getFormData = () => Object.assign(this.state, { valid: this.isValid() });

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox'
      ? target.checked
      : target.value;
    const name = target.name;

    this.setState({ [name]: value });
  }

  /**
   * Handles the change event on the day input field.
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
   * Handles the change event on an input field of time type.
   *
   * @param {Date} date The date value. Only matters the time part of the date.
   *
   * @since 0.1.0
   */
  handleTimeChange = (name, minutes) => {
    if (name === 'dep') {
      this.setState({ time: minutes });
    } else if (name === 'dur') {
      this.setState({ duration: minutes });
    }
  }

  handleStartValidation = () => (this.state.time >= this.state.duration ? 'Start time should be less than end.' : '')

  handleEndValidation = () => (this.state.time + this.state.duration >= 24 * 60 ? 'End time should be less than 24.' : '')

  isValid = () =>
    ![this.handleStartValidation, this.handleEndValidation]
      .some(validator => validator() !== '')

  /**
   * Renders event types as select options.
   */
  renderEventTypeOptions = (types) => types.map((type) => (
    <option key={type.id} value={type.id}>
      {this
        .l18n
        .findTranslationById(type, 'i18nEventTypeName')}&nbsp;/&nbsp;{this
          .l18n
          .findTranslationById(type, 'i18nEventTypeSubname')}
    </option>
  ))

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

    const startValidation = this.handleStartValidation();
    const endValidation = this.handleEndValidation();

    return (
      <div>
        <label htmlFor="day" className="pt-label pt-inline">
          <span className={styles.label_text}>Day</span>
          <DateInput id="day" value={this.state.date} onChange={this.handleDayChange} />
        </label>


        <label htmlFor="type" className="pt-label pt-inline">
          <span className={styles.label_text}>Type</span>
          <div className="pt-select pt-minimal">
            <select id="type" name="type" value={this.state.type} onChange={this.handleInputChange}>
              <option key={0} value={0}>Select a type...</option>
              {types}
            </select>
          </div>
        </label>

        <TimeFieldGroup name="dep" caption="Start" minutes={this.state.time} onChange={this.handleTimeChange} validation={startValidation} />
        <TimeFieldGroup name="dur" caption="End" minutes={this.state.duration} onChange={this.handleTimeChange} validation={endValidation} />

        <label htmlFor="status" className="pt-label pt-inline">
          <span className={styles.label_text}>Status</span>
          <div className="pt-select pt-minimal">
            <select id="status" name="status" value={this.state.status} onChange={this.handleInputChange}>
              <option key={0} value={0}>Select a status...</option>
              {statuses}
            </select>
          </div>
        </label>

        <label htmlFor="gate" className="pt-label pt-inline">
          <span className={styles.label_text}> Gate</span>
          <div className="pt-select pt-minimal">
            <select id="gate" name="gate" value={this.state.gate} onChange={this.handleInputChange}>
              <option value={0}>Select a gate...</option>
              <option value="1">One</option>
              <option value="2">Two</option>
              <option value="3">Three</option>
              <option value="4">Four</option>
            </select>
          </div>
        </label>

        <label htmlFor="destination" className="pt-label pt-inline">
          <span className={styles.label_text}>Destination</span>
          <div className="pt-select pt-minimal">
            <select id="destination" name="destination" value={this.state.destination} onChange={this.handleInputChange}>
              <option key={0} value={0}>Select a destination...</option>
              {destinations}
            </select>
          </div>
        </label>

        <label htmlFor="cost" className="pt-label pt-inline">
          <span className={styles.label_text}>Cost</span>
          <input
            className="pt-input" id="cost" name="cost" type="text"
            placeholder="The ticket cost" dir="auto"
            value={this.state.cost} onChange={this.handleInputChange}
          />
        </label>

        <label htmlFor="limit" className="pt-label pt-inline">
          <span className={styles.label_text}>Limit</span>
          <input
            id="limit"
            name="limit"
            className="pt-input .modifier"
            type="text"
            placeholder="Tickets' limit"
            dir="auto"
            value={this.state.limit}
            onChange={this.handleInputChange}
          />
        </label>

        <label htmlFor="bought" className="pt-label pt-inline">
          <span className={styles.label_text}>Bought</span>
          <input
            id="bought"
            name="bought"
            className="pt-input .modifier"
            type="text"
            placeholder="Tickets bought"
            dir="auto"
            value={this.state.bought}
            onChange={this.handleInputChange}
          />
        </label>
      </div>
    );
  }
}
