import React, {Component} from 'react';

export default class NavigationBar extends Component {
  render() {
    return (
      <nav className="pt-navbar">
        <div className="pt-navbar-group pt-align-left">
          <div className="pt-navbar-heading">Core</div>
        </div>
        <div className="pt-navbar-group pt-align-right">
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
