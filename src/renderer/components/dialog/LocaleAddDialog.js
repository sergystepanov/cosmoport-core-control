import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dialog, Button, Intent } from '@blueprintjs/core';

import LocaleForm from '../form/locale/LocaleForm';

export default class LocaleAddDialog extends Component {
  static propTypes = {
    callback: PropTypes.func,
  };

  static defaultProps = {
    callback: () => {},
  };

  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      code: '',
      description: '',
    };
  }

  handleChange = (code, description) => {
    this.setState({
      ...(code && { code }),
      ...(description && { description }),
    });
  };

  passState = () => {
    const { code, description } = this.state;
    this.props.callback({ code, description });
  };

  toggleDialog = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  };

  render() {
    const { code, description } = this.state;

    return (
      <Dialog
        iconName="translate"
        isOpen={this.state.isOpen}
        onClose={this.toggleDialog}
        canOutsideClickClose={false}
        title="Create locale"
      >
        <div className="bp5-dialog-body">
          <LocaleForm
            code={code}
            description={description}
            onChange={this.handleChange}
          />
        </div>
        <div className="bp5-dialog-footer">
          <div className="bp5-dialog-footer-actions">
            <Button
              intent={Intent.PRIMARY}
              onClick={this.passState}
              text="Create"
            />
          </div>
        </div>
      </Dialog>
    );
  }
}
