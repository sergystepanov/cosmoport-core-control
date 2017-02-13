import React, {Component} from 'react';
import {Dialog, Button, Intent} from "@blueprintjs/core";
import EventForm from '../form/EventForm';

export default class EventAddDialog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false
    };

    this.toggleDialog = this
      .toggleDialog
      .bind(this)

    this.passState = this.passState.bind(this);
  }
  render() {
    return (
      <Dialog
        iconName="airplane"
        isOpen={this.state.isOpen}
        onClose={this.toggleDialog}
        canOutsideClickClose={false}
        title="Create event">
        <div className="pt-dialog-body">
          <EventForm ref='form'/>
        </div>
        <div className="pt-dialog-footer">
          <div className="pt-dialog-footer-actions">
            <Button intent={Intent.PRIMARY} onClick={this.passState} text="Create"/>
          </div>
        </div>
      </Dialog>
    );
  }

  passState(state) {
    this.props.callback(this.refs.form.getFormData());
  }

  toggleDialog() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
}
