import React, {Component} from 'react';

import NavLink from './NavLink';
import ServerTime from '../../components/time/ServerTime';

export default class NavigationBar extends Component {
  render() {
    return (
      <nav className="pt-navbar">
        <div className="pt-navbar-group pt-align-left">
          <span className="pt-icon-standard pt-icon-predictive-analysis">&nbsp;</span>
          <div className="pt-navbar-heading app-caption">Core control (0.1.0)</div>
          <NavLink to="/">
            <span className="pt-icon-standard pt-icon-home"/>
          </NavLink>
          <NavLink to="/translation">
            <span className="pt-icon-standard pt-icon-translate"/>
          </NavLink>
          <NavLink to="/table">
            <span className="pt-icon-standard pt-icon-timeline-events"/>
          </NavLink>
        </div>
        <div className="pt-navbar-group pt-align-right">
          <span>{this.props.nodes.timetables}/{this.props.nodes.gates}</span>
          <span className="pt-navbar-divider"/>
          <ServerTime timestamp={this.props.timestamp}/>
        </div>
      </nav>
    );
  }
}
