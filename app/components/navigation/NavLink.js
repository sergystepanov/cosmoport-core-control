import React, {Component} from 'react';
import {Link} from 'react-router';

import styles from './Navigation.css';

export default class NavLink extends Component {
  render() {
    return <Link activeClassName={styles.activeLink} {...this.props} className="nav-link" />;
  }
}
