import React, { Component, PropTypes } from 'react';
import { Dialog, Button, Intent } from '@blueprintjs/core';

import EventTypePropType from '../../props/EventTypePropType';
import EventDestinationPropType from '../../props/EventDestinationPropType';
import EventStatusPropType from '../../props/EventStatusPropType';
import LocalePropType from '../../props/LocalePropType';
import GatePropType from '../../props/GatePropType';
import EventForm from '../form/EventForm';

/**
 * The class for event edit dialog.
 *
 * @since 0.1.1
 */
export default class EventEditDialog extends Component {
  static propTypes = {
    event: PropTypes.object,
    callback: PropTypes.func.isRequired,
    refs: PropTypes.shape({
      destinations: PropTypes.arrayOf(EventDestinationPropType),
      statuses: PropTypes.arrayOf(EventStatusPropType),
      types: PropTypes.arrayOf(EventTypePropType)
    }).isRequired,
    locale: LocalePropType.isRequired,
    gates: PropTypes.arrayOf(GatePropType)
  }

  static defaultProps = {
    event: null,
    callback: () => { },
    refs: {
      destinations: [],
      statuses: [],
      types: []
    },
    locale: {},
    gates: []
  }

  constructor(props) {
    super(props);

    this.state = { isOpen: false, event: null };
  }

  passState = () => {
    this.props.callback(this.form.getFormData());
  }

  toggleDialog = () => {
    this.setState({ isOpen: !this.state.isOpen });
  }

  edit = (event) => {
    this.setState({ event: event }, () => this.toggleDialog());
  }

  render() {
    const { isOpen } = this.state;
    const { locale, refs, event, gates } = this.props;

    return (
      <Dialog isOpen={isOpen} onClose={this.toggleDialog} canOutsideClickClose={false} title="Edit event" >
        <div className="pt-dialog-body">
          <EventForm event={this.state.event} ref={(c) => { this.form = c; }} locale={locale} refs={refs} gates={gates} />
        </div>
        <div className="pt-dialog-footer">
          <div className="pt-dialog-footer-actions">
            <Button intent={Intent.PRIMARY} onClick={this.passState} text="Update" />
          </div>
        </div>
      </Dialog>
    );
  }
}
