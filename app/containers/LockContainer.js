import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class LockContainer extends PureComponent {
  static propTypes = {
    onDeAuth: PropTypes.func
  }

  static defaultProps = {
    onDeAuth: () => { }
  }

  shouldComponentUpdate() {
    return false;
  }

  handleClick = () => {
    this.props.onDeAuth();
  }

  render() {
    return (
      <div className="pt-non-ideal-state" style={{ marginTop: '1em' }}>
        <h4 className="pt-non-ideal-state-title">Here you can go back to normal user mode.</h4>
        <div className="pt-non-ideal-state-description">
          <button onClick={this.handleClick}>Logout</button>
        </div>
      </div>
    );
  }
}
