import React, { PureComponent } from 'react';

export default class LockContainer extends PureComponent {
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
