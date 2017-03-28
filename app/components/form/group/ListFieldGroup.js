import React, { PureComponent, PropTypes } from 'react';

import styles from '../EventForm.css';

export default class ListFieldGroup extends PureComponent {
  static propTypes = {
    name: PropTypes.string.isRequired,
    caption: PropTypes.string,
    index: PropTypes.number,
    onChange: PropTypes.func,
    validation: PropTypes.string,
    children: PropTypes.node
  }

  static defaultProps = {
    caption: '',
    index: 0,
    onChange: () => { },
    validation: '',
    children: null
  }

  handleSelectChange = (event) => {
    this.props.onChange(this.props.name, parseInt(event.target.value, 10));
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
          <div className="pt-select pt-minimal">
            <select
              id={this.props.name}
              name={this.props.name}
              value={this.props.index}
              onChange={this.handleSelectChange}
            >
              <option key={0} value={0}>{`Select a ${caption.toLowerCase()}...`}</option>
              {this.props.children}
            </select>
          </div>
          {invalid && <div className="pt-form-helper-text">{this.props.validation}</div>}
        </div>
      </div>
    );
  }
}
