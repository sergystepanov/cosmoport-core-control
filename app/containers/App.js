// @flow
import React, {Component} from 'react';

import NavigationBar from '../components/navigation/NavigationBar';
import styles from './App.css';
import ApiV1 from '../../lib/core-api-client/ApiV1';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      timestamp: 0
    };
  }

  componentDidMount() {
    this.api = new ApiV1();
    this
      .api
      .fetchTime((data) => {
        this.setState({timestamp: data.timestamp});
      }, () => {});
  }

  props : {
    children: HTMLElemen
  };

  render() {
    return (
      <div className="pt-ui-text">
        <div className={styles.container}>
          <NavigationBar timestamp={this.state.timestamp}/>
          <div className={styles.content}>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}
