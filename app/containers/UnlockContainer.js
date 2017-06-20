import React, { Component } from 'react';
import PropTypes from 'prop-types';

const ImLucky = (min, max) => {
  const mini = Math.ceil(min);
  const maxi = Math.floor(max);

  return Math.floor(Math.random() * ((maxi - mini) + 1)) + mini;
};
const what = ['flash', 'moon'];

export default class UnlockContainer extends Component {
  static propTypes = {
    onAuth: PropTypes.func
  }

  static defaultProps = {
    onAuth: () => { }
  }

  // shouldComponentUpdate() {
  //   return false;
  // }

  handleInput = (event) => {
    // make debounce
    this.props.onAuth(event.target.value);
  }

  render() {
    const nextIcon = what[ImLucky(0, 1)];

    return (<div className="pt-non-ideal-state" style={{ marginTop: '1em' }}>
      <div className="pt-non-ideal-state-visual pt-non-ideal-state-icon">
        <span className={`pt-icon pt-icon-${nextIcon}`} />
      </div>
      <h4 className="pt-non-ideal-state-title">Here you can enter the password.</h4>
      <div className="pt-non-ideal-state-description">
        <input type="password" onChange={this.handleInput} />
      </div>
    </div>);
  }
}
