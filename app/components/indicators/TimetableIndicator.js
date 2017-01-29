import React, {Component} from 'react';

export default class TimetableIndicator extends Component {
  render() {
    return (
      <div>
        <span>tables: {this.props.count}</span>
      </div>
    );
  }
}
