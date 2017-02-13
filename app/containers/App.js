// @flow
import React, {Component} from 'react';

import NavigationBar from '../components/navigation/NavigationBar';
import styles from './App.css';

export default class App extends Component {
  props : {
    children: HTMLElemen
  };

  render() {
    return (
      <div className="pt-ui-text">
        <div className={styles.container}>
          <NavigationBar/> {this.props.children}
        </div>
      </div>
    );
  }
}
