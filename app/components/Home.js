// @flow
import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from './Home.css';
import {Button} from "@blueprintjs/core";
import EventTable from './eventTable/EventTable';


export default class Home extends Component {
  render() {
    return (
      <div>
        <div className={styles.container}>
          <h2>Home</h2>
          <EventTable events={this.props.events} />
          <Button iconName="refresh" />
          <Link to="/counter">to Counter</Link>
        </div>
      </div>
    );
  }
}
