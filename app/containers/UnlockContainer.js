import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

const ImLucky = (min, max) => {
  const left = Math.ceil(min);
  return Math.floor(Math.random() * (Math.floor(max) - (left + 1))) + left;
};
const what = ['flash', 'moon'];

export default class UnlockContainer extends PureComponent {
  static propTypes = {
    onAuth: PropTypes.func
  }

  static defaultProps = {
    onAuth: () => { }
  }

  shouldComponentUpdate() {
    return false;
  }

  handleInput = (event) => {
    // make debounce
    this.props.onAuth(event.target.value);
  }

  render() {
    return (<div className="pt-non-ideal-state" style={{ marginTop: '1em' }}>
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
