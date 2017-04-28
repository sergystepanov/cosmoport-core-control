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
          <div className="pt-callout">
            You should fill the fields with a text of default locale.
            After the save the text will be copied to other locales
            and don&apos;t forget to translate it later in the dedicated translation
            interfase of the application (<span className="pt-icon-translate" />).
          </div>
          <p>&nbsp;</p>
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
