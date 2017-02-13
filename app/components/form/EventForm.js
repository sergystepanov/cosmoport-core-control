import React, {Component} from 'react';
import styles from './EventForm.css';

export default class EventForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      duration: 0
    };

    this.handleInputChange = this
      .handleInputChange
      .bind(this);

    this.getFormData = this
      .getFormData
      .bind(this)
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox'
      ? target.checked
      : target.value;
    const name = target.name;

    this.setState({[name]: value});
  }

  getFormData() {
    return this.state;
  }

  render() {
    return (
      <div ref="container" className={styles.event_form}>
        <div
          className={'pt-select pt-minimal ' + styles.dropdown}
          style={{
          marginBottom: '1em'
        }}>
          <select>
            <option >Select a type...</option>
            <option value="1">One</option>
            <option value="2">Two</option>
            <option value="3">Three</option>
            <option value="4">Four</option>
          </select>
        </div>
        <div
          className={'pt-select pt-minimal ' + styles.dropdown}
          style={{
          marginBottom: '1em'
        }}>
          <select>
            <option>Select a status...</option>
            <option value="1">One</option>
            <option value="2">Two</option>
            <option value="3">Three</option>
            <option value="4">Four</option>
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
          <span className={styles.label_text}>Destination</span>
          <input
            className="pt-input pt-inline"
            type="text"
            placeholder="Destination"
            dir="auto"/>
        </label>
        <label className="pt-label pt-inline">
          <span className={styles.label_text}>Cost</span>
          <input
            className="pt-input .modifier"
            type="text"
            placeholder="The ticket cost"
            dir="auto"/>
        </label>
        <label className="pt-label pt-inline">
          <span className={styles.label_text}>Departure</span>
          <input
            className="pt-input .modifier"
            type="text"
            placeholder="The departure time"
            dir="auto"/>
        </label>

        <label className="pt-label pt-inline">
          <span className={styles.label_text}>Limit</span>
          <input
            className="pt-input .modifier"
            type="text"
            placeholder="Tickets' limit"
            dir="auto"/>
        </label>
        <label className="pt-label pt-inline">
          <span className={styles.label_text}>Bought</span>
          <input
            className="pt-input .modifier"
            type="text"
            placeholder="Tickets bought"
            dir="auto"/>
        </label>
      </div>
    );
  }
}
