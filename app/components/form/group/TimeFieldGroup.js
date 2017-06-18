import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { TimePicker } from '@blueprintjs/datetime';

import _date from '../../../components/date/_date';

import styles from '../EventForm.css';

export default class TimeFieldGroup extends PureComponent {
  static propTypes = {
    name: PropTypes.string.isRequired,
    caption: PropTypes.string.isRequired,
    minutes: PropTypes.number,
    onChange: PropTypes.func,
    validator: PropTypes.string
  }

  static defaultProps = {
    minutes: 0,
    message: '',
    onChange: () => { },
    validator: ''
  }

  handleTimeChange = (date) => {
    this.props.onChange(this.props.name, _date.toMinutes(date));
  }

  render() {
    const invalid = this.props.validator !== '';
    const invalidMaybeClass = invalid ? ' pt-intent-danger' : '';

    return (
      <div className={`pt-form-group${invalidMaybeClass}`}>
        <label htmlFor={this.props.name} className={`pt-label pt-inline ${styles.label_text_short}`}>
          <span>{this.props.caption}</span>
        </label>
        <div className={`pt-form-content${invalidMaybeClass}`}>
          <TimePicker
            id={this.props.name}
            className={styles.noPadding}
            value={_date.toDate(this.props.minutes)}
            onChange={this.handleTimeChange}
          />
          {invalid && <div className="pt-form-helper-text">{this.props.validator}</div>}
        </div>
      </div>
    );
  }
}
