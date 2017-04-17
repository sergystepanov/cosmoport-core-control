import React, { Component } from 'react';
import { Alert } from '@blueprintjs/core';

export default class EventDeleteAlert extends Component {
  constructor(props) {
    super(props);

    this.state = { id: 0, isOpen: false };
  }

  open = (idd) => {
    this.setState({ id: idd, isOpen: !this.state.isOpen });
  }

  handleConfirm = () => {
    this.props.onConfirm(this.state.id);
    this.setState({ id: 0, isOpen: false });
  }

  handleClose = () => this.setState({ id: 0, isOpen: false })

  render() {
    return (<Alert
      isOpen={this.state.isOpen}
      confirmButtonText="Delete"
      cancelButtonText="Cancel"
      onConfirm={this.handleConfirm}
      onCancel={this.handleClose}
    >
      <p>
        Are you sure you want to delete selected <b>event</b>? You will not be able to restore it.
       </p>
    </Alert>);
  }
}
