import React, {Component} from 'react';
import {DateInput, TimePicker} from '@blueprintjs/datetime';

import L18n from '../l18n/L18n';

import styles from './EventForm.css';

export default class EventForm extends Component {
  constructor(props) {
    super(props);

    this.l18n = new L18n(this.props.locale, this.props.refs);

    this.state = {
      date: new Date(),
      time: new Date(),
      duration: 0,
      limit: 1,
      bought: 0
    };
  }

  getFormData = () => this.state

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox'
      ? target.checked
      : target.value;
    const name = target.name;

    this.setState({[name]: value});
  }

  handleDateChange = (day, selectedDate) => {
    if (selectedDate !== null) {
      this.setState({date: selectedDate});
    }
  }

  handleTimeChange = (date) => {
    this.setState({time: date});
  }

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

  /**
   * Renders event statuses as select options.
   */
  renderEventStatusOptions = (statuses) => statuses.map((status) => (
    <option key={status.id} value={status.id}>
      {this
        .l18n
        .findTranslationById(status, 'i18nStatus')}
    </option>
  ))

  /**
   * Renders event destinations as select options.
   */
  renderEventDestinationOptions = (destinations) => destinations.map((dest) => (
    <option key={dest.id} value={dest.id}>
      {this
        .l18n
        .findTranslationById(dest, 'i18nEventDestinationName')}
    </option>
  ))

  render() {
    return (
      <div>
        <label className="pt-label pt-inline">
          <span className={styles.label_text}>Day</span>
        </label>
        <DateInput
          value={this.state.date}
          onChange={this
          .handleDateChange
          .bind(this, 'day')}/>
        <div ref="container" className={styles.event_form}>
          <div
            className={'pt-select pt-minimal ' + styles.dropdown}
            style={{
            marginBottom: '1em'
          }}>
            <select>
              <option key={0}>Select a type...</option>
              {this.renderEventTypeOptions(this.props.refs.types)}
            </select>
          </div>
          <div
            className={'pt-select pt-minimal ' + styles.dropdown}
            style={{
            marginBottom: '1em'
          }}>
            <select>
              <option key={0}>Select a status...</option>
              {this.renderEventStatusOptions(this.props.refs.statuses)}
            </select>
          </div>

          <div
            className={'pt-select pt-minimal ' + styles.dropdown}
            style={{
            marginBottom: '1em'
          }}>
            <select>
              <option >Select a gate...</option>
              <option value="1">One</option>
              <option value="2">Two</option>
              <option value="3">Three</option>
              <option value="4">Four</option>
            </select>
          </div>

          <div
            className={`pt-select pt-minimal ${styles.dropdown}`}
            style={{
            marginBottom: '1em'
          }}>
            <select>
              <option key={0}>Select a destination...</option>
              {this.renderEventDestinationOptions(this.props.refs.destinations)}
            </select>
          </div>

          <label className="pt-label pt-inline">
            <span className={styles.label_text}>Duration</span>
            <input
              name="duration"
              className="pt-input .modifier"
              type="text"
              placeholder="The event duration in minutes"
              dir="auto"
              value={this.state.duration}
              onChange={this.handleInputChange}/>
          </label>
          <label className="pt-label pt-inline">
            <span className={styles.label_text}>Cost</span>
            <input
              className="pt-input .modifier"
              type="text"
              placeholder="The ticket cost"
              dir="auto"
              value={0}/>
          </label>
          <label className="pt-label pt-inline">
            <span className={styles.label_text}>Departure</span>
          </label>

          <TimePicker value={this.state.time} onChange={this.handleTimeChange}/>

          <label className="pt-label pt-inline">
            <span className={styles.label_text}>Limit</span>
            <input
              className="pt-input .modifier"
              type="text"
              placeholder="Tickets' limit"
              dir="auto"
              value={this.state.limit}/>
          </label>
          <label className="pt-label pt-inline">
            <span className={styles.label_text}>Bought</span>
            <input
              className="pt-input .modifier"
              type="text"
              placeholder="Tickets bought"
              dir="auto"
              value={this.state.bought}/>
          </label>
        </div>
      </div>
    );
  }
}
