import React, { PureComponent, PropTypes } from 'react';

export default class LabelFieldGroup extends PureComponent {
  static propTypes = {
    value: PropTypes.string
  }

  static defaultProps = {
    value: ''
  }

  render() {
    return (<div className={this.props.className}><span>{this.props.value}</span></div>);
  }
}
