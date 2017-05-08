import React, { Component } from 'react';

import PageCaption from '../components/page/PageCaption';

export default class SimulationContainer extends Component {
  constructor(props) {
    super(props);

    this.api = this.props.api;
  }

  render() {
    return (
      <div>
        <PageCaption text="02 Simulation (WIP)" />
        <div className="pt-callout">
          Here you can run the system simulation.
          Be aware that all data will be affected by this.
        </div>
      </div>
    );
  }
}
