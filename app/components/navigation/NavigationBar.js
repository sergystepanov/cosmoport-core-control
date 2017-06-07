import React, { Component, PropTypes } from 'react';

import NavLink from './NavLink';
import ServerTime from '../../components/time/ServerTime';
import Player from '../player/Player';

const Navigate = (props) => <NavLink to={props.to} onlyActiveOnIndex={props.onlyActiveOnIndex}><span className={`pt-icon-standard pt-icon-${props.icon}`} /></NavLink>;
Navigate.propTypes = { to: PropTypes.string.isRequired, icon: PropTypes.string.isRequired };

export default class NavigationBar extends Component {
  render() {
    return (
      <nav className="pt-navbar">
        <div className="pt-navbar-group pt-align-left">
          <span className="pt-icon-standard pt-icon-predictive-analysis">&nbsp;</span>
          <div className="pt-navbar-heading app-caption">
            Control
            <span className="version">0.1.3</span>
          </div>
          <div className="menu">
            <Navigate to="/" icon="home" onlyActiveOnIndex />
            <Navigate to="/simulation" icon="globe" />
            <Navigate to="/table" icon="timeline-events" />
            {this.props.authed && <Navigate to="/translation" icon="translate" />}
            {this.props.authed && <Navigate to="/settings" icon="cog" />}
            {!this.props.authed && <Navigate to="/login" icon="lock" />}
            {this.props.authed && <Navigate to="/logout" icon="unlock" />}
          </div>
        </div>
        <div className="pt-navbar-group pt-align-right">
          <Player music={this.props.audio} />
          <span className="pt-navbar-divider" />
          <span>{this.props.nodes.timetables}/{this.props.nodes.gates}</span>
          <span className="pt-navbar-divider" />
          <ServerTime timestamp={this.props.timestamp} />
        </div>
      </nav>
    );
  }
}
