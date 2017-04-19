import React, { Component, PropTypes } from 'react';
import { Dialog, Button, Intent } from '@blueprintjs/core';

import EventTypeForm from '../form/event/EventTypeForm';

/**
 * The class for event type add dialog.
 *
 * @since 0.1.0
 */
export default class EventTypeAddDialog extends Component {
  static propTypes = { callback: PropTypes.func.isRequired }
  static defaultProps = { callback: () => { } }

  constructor(props) {
    super(props);

    this.state = { isOpen: false };
  }

  passState = () => {
    this.props.callback(this.form.getFormData());
  }

  toggleDialog = () => {
    this.setState({ isOpen: !this.state.isOpen });
  }

  render() {
    return (
      <Dialog isOpen={this.state.isOpen} onClose={this.toggleDialog} canOutsideClickClose={false} title="Create new event type">
        <div className="pt-dialog-body">
          <EventTypeForm ref={(c) => { this.form = c; }} />
        </div>
        <div className="pt-dialog-footer">
          <div className="pt-dialog-footer-actions">
            <Button intent={Intent.PRIMARY} onClick={this.passState} text="Create" />
          </div>
        </div>
      </Dialog>
    );
  }
}
