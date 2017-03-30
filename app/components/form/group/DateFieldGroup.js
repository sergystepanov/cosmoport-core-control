import React, { PureComponent, PropTypes } from 'react';
import { DateInput } from '@blueprintjs/datetime';

import styles from '../EventForm.css';

export default class DateFieldGroup extends PureComponent {
  static propTypes = {
    name: PropTypes.string.isRequired,
    caption: PropTypes.string.isRequired,
    date: PropTypes.instanceOf(Date),
    onChange: PropTypes.func,
    validator: PropTypes.string
  }

  static defaultProps = {
    date: new Date(),
    message: '',
    onChange: () => { },
    validator: ''
  }

  handleDateChange = (date) => {
    this.props.onChange(this.props.name, date);
  }

  render() {
    const invalid = this.props.validator !== '';
    const invalidMaybeClass = invalid ? ' pt-intent-danger' : '';

    return (
      <div className={`pt-form-group pt-inline${invalidMaybeClass}`}>
        <label htmlFor={this.props.name} className={`pt-label pt-inline ${styles.label_text_short}`}>
          <span>{this.props.caption}</span>
        </label>
        <div className={`pt-form-content${invalidMaybeClass}`}>
          <DateInput
            id={this.props.name}
            className={styles.fullWidth}
            value={this.props.date}
            showActionsBar
            onChange={this.handleDateChange}
          />
          {invalid && <div className="pt-form-helper-text">{this.props.validator}</div>}
        </div>
      </div>
    );
  }
}
