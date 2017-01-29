import React, {Component} from 'react';

export default class GateIndicator extends Component {
  render() {
    return (
      <div>
        <span>gates: {this.props.count}</span>
      </div>
    );
  }
}
