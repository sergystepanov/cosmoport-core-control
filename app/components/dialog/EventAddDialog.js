import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dialog, Button, Intent } from '@blueprintjs/core';

import RefsPropType from '../../props/RefsPropType';
import LocalePropType from '../../props/LocalePropType';
import GatePropType from '../../props/GatePropType';
import EventForm from '../form/EventForm';

/**
 * The class for event add dialog.
 *
 * @since 0.1.0
 */
export default class EventAddDialog extends Component {
  static propTypes = {
    callback: PropTypes.func.isRequired,
    refs: RefsPropType.isRequired,
    locale: LocalePropType.isRequired,
    gates: PropTypes.arrayOf(GatePropType).isRequired
  }

  static defaultProps = {
    callback: () => { },
    gates: []
  }

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
      <Dialog
        iconName="airplane"
        isOpen={this.state.isOpen}
        onClose={this.toggleDialog}
        canOutsideClickClose={false}
        title="Create event"
      >
        <div className="pt-dialog-body">
          <EventForm
            ref={(c) => {
              this.form = c;
            }}
            locale={this.props.locale}
            refs={this.props.refs}
            gates={this.props.gates}
            forCreate
          />
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
