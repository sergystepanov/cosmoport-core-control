import React, { PureComponent, PropTypes } from 'react';
import { TimePicker } from '@blueprintjs/datetime';

import _date from '../../../components/date/_date';

import styles from '../EventForm.css';

export default class TimeFieldGroup extends PureComponent {
  static propTypes = {
    name: PropTypes.string.isRequired,
    caption: PropTypes.string.isRequired,
    minutes: PropTypes.number,
    onChange: PropTypes.func,
    validation: PropTypes.string
  }

  static defaultProps = {
    minutes: 0,
    message: '',
    onChange: () => { },
    validation: ''
  }

  handleTimeChange = (date) => {
    this.props.onChange(this.props.name, _date.toMinutes(date), this.invlalidate);
  }

  render() {
    const invalid = this.props.validation !== '';

    return (
      <div className={`pt-form-group pt-inline ${invalid && 'pt-intent-danger'}`}>
        <label htmlFor={this.props.name} className={`pt-label pt-inline ${styles.label_text}`}>
          <span>{this.props.caption}</span>
        </label>
        <div className={`pt-form-content ${invalid && 'pt-intent-danger'}`}>
          <TimePicker
            id={this.props.name}
            value={_date.toDate(this.props.minutes)}
            onChange={this.handleTimeChange}
            showArrowButtons
          />
          {invalid && <div className="pt-form-helper-text">{this.props.validation}</div>}
        </div>
      </div>
    );
  }
}
