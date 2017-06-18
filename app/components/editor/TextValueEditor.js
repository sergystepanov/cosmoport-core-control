import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { EditableText } from '@blueprintjs/core';

export default class TextValueEditor extends Component {
  static propTypes = {
    id: PropTypes.number,
    text: PropTypes.string,
    className: PropTypes.string,
    onConfirm: PropTypes.func
  }

  static defaultProps = {
    id: 0,
    text: '',
    className: '',
    onConfirm: () => { }
  }

  onConfirm = (value) => {
    this.props.onConfirm(this.props.id, value, this.props.text);
  }

  render() {
    return <EditableText className={this.props.className} placeholder="" selectAllOnFocus value={this.props.text} onConfirm={this.onConfirm} />;
  }
}
