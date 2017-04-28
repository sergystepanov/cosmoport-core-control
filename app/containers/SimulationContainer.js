import React, { Component } from 'react';

import PageCaption from '../components/page/PageCaption';

export default class SimulationContainer extends Component {
  render() {
    return (
      <div>
        <PageCaption text="02 Simulation" />
        <div className="pt-callout">
          [WIP] Here you can run the system simulation.
          Be aware that all data will be affected by this.
        </div>
      </div>
    );
  }
}
