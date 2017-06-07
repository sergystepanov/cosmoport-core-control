import React, { Component, PropTypes } from 'react';

import Api from '../../lib/core-api-client/ApiV1';

import styles from './App.css';

const ImLucky = (min, max) => {
  const min_ = Math.ceil(min);
  const max_ = Math.floor(max);
  return Math.floor(Math.random() * (max_ - min_ + 1)) + min_;
};
const what = ['flash', 'moon'];

export default class UnlockContainer extends Component {
  static propTypes = {
    api: PropTypes.instanceOf(Api)
  }

  static defaultProps = {
    api: null
  }

  handleInput = (event) => {
    const value = event.target.value;

    // make debounce
    this.props.onAuth(value);
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (<div className="pt-non-ideal-state" style={{marginTop: '1em'}}>
      <div className="pt-non-ideal-state-visual pt-non-ideal-state-icon">
        <span className={`pt-icon pt-icon-${what[ImLucky(0, 1)]}`} />
      </div>
      <h4 className="pt-non-ideal-state-title">Here you can enter the password.</h4>
      <div className="pt-non-ideal-state-description">
        <input type="password" onChange={this.handleInput} />
      </div>
    </div>);
  }
}
