import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { NavLink } from 'react-router-dom';
import ServerTime from '../../components/time/ServerTime';
import Player from '../player/Player';

import styles from './Navigation.css';

const Navigate = (props) => (
  <NavLink to={props.to} activeClassName={styles.activeLink} exact={props.exact} className="nav-link">
    <span className={`pt-icon-standard pt-icon-${props.icon}`} />
  </NavLink>
);
Navigate.propTypes = {
  to: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  exact: PropTypes.bool
};
Navigate.defaultProps = {
  exact: false
};

export default class NavigationBar extends Component {
  static propTypes = {
    auth: PropTypes.bool
  }

  static defaultProps = {
    auth: false
  }

  render() {
    const { auth: auth_, audio, nodes, timestamp } = this.props;
    return (
      <nav className="pt-navbar">
        <div className="pt-navbar-group pt-align-left">
          <div className="pt-navbar-heading app-caption">
            Control
            <span className="version">0.1.3</span>
          </div>
          <div className="menu">
            <Navigate to="/" icon="home" exact />
            <Navigate to="/simulation" icon="globe" />
            <Navigate to="/table" icon="timeline-events" />
            {auth_ && <Navigate to="/translation" icon="translate" />}
            {auth_ && <Navigate to="/settings" icon="cog" />}
            {!auth_ && <Navigate to="/login" icon="lock" />}
            {auth_ && <Navigate to="/logout" icon="unlock" />}
          </div>
        </div>
        <div className="pt-navbar-group pt-align-right">
          <Player music={audio} />
          <span className="pt-navbar-divider" />
          <span>{nodes.timetables}/{nodes.gates}</span>
          <span className="pt-navbar-divider" />
          <ServerTime timestamp={timestamp} />
        </div>
      </nav>
    );
  }
}
