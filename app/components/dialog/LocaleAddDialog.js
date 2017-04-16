import React, {Component} from 'react';
import {Dialog, Button, Intent} from '@blueprintjs/core';

import LocaleForm from '../form/locale/LocaleForm';

export default class LocaleAddDialog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false
    };

    this.toggleDialog = this
      .toggleDialog
      .bind(this);

    this.passState = this
      .passState
      .bind(this);
  }

  render() {
    return (
      <Dialog
        iconName="translate"
        isOpen={this.state.isOpen}
        onClose={this.toggleDialog}
        canOutsideClickClose={false}
        title="Create locale">
        <div className="pt-dialog-body">
          <LocaleForm ref='form'/>
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
    this
      .props
      .callback(this.refs.form.getFormData());
  }

  toggleDialog() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
}
