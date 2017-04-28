import React, { Component } from 'react';

export default class RemoteAddress extends Component {
  render() {
    return (
      <div className="pt-input-group .modifier">
        <input className="pt-input" placeholder="http://192.168.0.100:3333" dir="auto" />
      </div>);
  }
}
