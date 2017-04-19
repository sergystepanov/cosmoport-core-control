import React, { PureComponent, PropTypes } from 'react';

import styles from '../EventForm.css';

export default class TextFieldGroup extends PureComponent {
  static propTypes = {
    name: PropTypes.string.isRequired,
    caption: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    validator: PropTypes.string,
    inline: PropTypes.bool
  }

  static defaultProps = {
    caption: '',
    value: '',
    onChange: () => { },
    validator: '',
    inline: false
  }

  handleChange = (event) => {
    this.props.onChange(this.props.name, event.target.value);
  }

  render() {
    const invalid = this.props.validator !== '';
    const caption = this.props.caption !== '' ? this.props.caption : this.props.name;
    const invalidMaybeClass = invalid ? ' pt-intent-danger' : '';

    return (
      <div className={`pt-form-group ${this.props.inline ? 'pt-inline' : ''}${invalidMaybeClass} ${this.props.className}`}>
        <label htmlFor={this.props.name} className={`pt-label pt-inline ${styles.label_text}`}>
          {caption}
        </label>
        <div className={`pt-form-content ${styles.fullWidth}${invalidMaybeClass}`}>
          <input
            id={this.props.name}
            className={invalidMaybeClass}
            value={this.props.value}
            onChange={this.handleChange}
          />
          {invalid && <div className="pt-form-helper-text">{this.props.validator}</div>}
        </div>
      </div>
    );
  }
}
