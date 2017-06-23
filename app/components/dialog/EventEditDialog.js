import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dialog, Button, Intent } from '@blueprintjs/core';

import RefsPropType from '../../props/RefsPropType';
import LocalePropType from '../../props/LocalePropType';
import GatePropType from '../../props/GatePropType';
import EventForm from '../form/EventForm';
import EventMapper from '../../components/mapper/EventMapper';

/**
 * The class for event edit dialog.
 *
 * @since 0.1.1
 */
export default class EventEditDialog extends Component {
  static propTypes = {
    callback: PropTypes.func.isRequired,
    refs: RefsPropType.isRequired,
    locale: LocalePropType.isRequired,
    gates: PropTypes.arrayOf(GatePropType)
  }

  static defaultProps = {
    event: null,
    callback: () => { },
    gates: []
  }

  constructor(props) {
    super(props);

    this.state = { isOpen: false, event: null };
  }

  passState = () => {
    this.props.callback(EventMapper.fromForm(this.form.getFormData()));
  }

  toggleDialog = () => {
    this.setState({ isOpen: !this.state.isOpen });
  }

  edit = (ev) => {
    this.setState({ event: ev }, () => this.toggleDialog());
  }

  render() {
    const { isOpen, event } = this.state;
    const { locale, refs, gates } = this.props;

    return (
      <Dialog isOpen={isOpen} onClose={this.toggleDialog} canOutsideClickClose={false} title="Edit event" >
        <div className="pt-dialog-body">
          <EventForm
            event={event}
            ref={(c) => { this.form = c; }}
            locale={locale}
            refs={refs}
            gates={gates}
          />
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
