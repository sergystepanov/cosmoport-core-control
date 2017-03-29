import React, { PureComponent, PropTypes } from 'react';
import { NumericInput } from '@blueprintjs/core';

import styles from '../EventForm.css';

export default class NumberFieldGroup extends PureComponent {
  static propTypes = {
    name: PropTypes.string.isRequired,
    caption: PropTypes.string,
    number: PropTypes.number,
    onChange: PropTypes.func,
    validation: PropTypes.string,
    icon: PropTypes.string
  }

  static defaultProps = {
    caption: '',
    number: 0,
    onChange: () => { },
    validation: '',
    icon: null
  }

  handleValueChange = (valueAsNumber) => {
    this.props.onChange(this.props.name, valueAsNumber);
  }

  render() {
    const invalid = this.props.validation !== '';
    const caption = this.props.caption !== '' ? this.props.caption : this.props.name;

    return (
      <div className={`pt-form-group pt-inline ${invalid && 'pt-intent-danger'}`}>
        <label htmlFor={this.props.name} className={`pt-label pt-inline ${styles.label_text}`}>
          {caption}
        </label>
        <div className={`pt-form-content ${invalid && 'pt-intent-danger'}`}>
          <NumericInput
            id={this.props.name}
            allowNumericCharactersOnly
            buttonPosition={'none'}
            leftIconName={this.props.icon}
            min={0}
            value={this.props.number}
            onValueChange={this.handleValueChange}
          />
          {invalid && <div className="pt-form-helper-text">{this.props.validation}</div>}
        </div>
      </div>
    );
  }
}
