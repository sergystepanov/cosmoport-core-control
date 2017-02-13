import React, {Component} from 'react';
import {Link} from 'react-router';

export default class NavigationBar extends Component {
  render() {
    return (
      <nav className="pt-navbar">
        <div className="pt-navbar-group pt-align-left">
          <span className="pt-icon-standard pt-icon-predictive-analysis">&nbsp;</span>
          <div className="pt-navbar-heading">Core control (0.1.0)</div>
          <Link to="/">back</Link>
          <Link to="/counter">page</Link>
          <Link to="/translation">translation</Link>
        </div>
        <div className="pt-navbar-group pt-align-right">
          <span>0/0</span>
          <span className="pt-navbar-divider"></span>
          <span>server time: xxxxx</span>
          <span className="pt-navbar-divider"></span>
          <button className="pt-button pt-minimal pt-icon-notifications"></button>
          <button className="pt-button pt-minimal pt-icon-cog"></button>
        </div>
      </nav>
    );
  }
}
