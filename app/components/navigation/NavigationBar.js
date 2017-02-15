import React, {Component} from 'react';
import {Link} from 'react-router';

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
          <span>0/0</span>
          <span className="pt-navbar-divider"/>
          <ServerTime timestamp={this.props.timestamp}/>
          <span className="pt-navbar-divider"/>
          <button className="pt-button pt-minimal pt-icon-notifications"/>
          <button className="pt-button pt-minimal pt-icon-cog"/>
        </div>
      </nav>
    );
  }
}
