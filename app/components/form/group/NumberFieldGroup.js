import React, { PureComponent, PropTypes } from 'react';
import { NumericInput, Intent } from '@blueprintjs/core';

import styles from '../EventForm.css';

export default class NumberFieldGroup extends PureComponent {
  static propTypes = {
    name: PropTypes.string.isRequired,
    caption: PropTypes.string,
    number: PropTypes.number,
    onChange: PropTypes.func,
    validator: PropTypes.string,
    icon: PropTypes.string,
    inline: PropTypes.bool
  }

  static defaultProps = {
    caption: '',
    number: 0,
    onChange: () => { },
    validator: '',
    icon: null,
    inline: false
  }

  handleValueChange = (valueAsNumber) => {
    this.props.onChange(this.props.name, valueAsNumber);
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
          <NumericInput
            id={this.props.name}
            allowNumericCharactersOnly
            intent={invalid ? Intent.DANGER : Intent.NONE}
            className={invalidMaybeClass}
            buttonPosition={'none'}
            leftIconName={this.props.icon}
            min={0}
            value={this.props.number}
            onValueChange={this.handleValueChange}
          />
          {invalid && <div className="pt-form-helper-text">{this.props.validator}</div>}
        </div>
      </div>
    );
  }
}
