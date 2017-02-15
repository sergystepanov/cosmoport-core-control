import React, {Component} from 'react';

export default class ServerTime extends Component {
  render() {
    return (
      <span>Time: {this.props.timestamp}</span>
    );
  }
}
