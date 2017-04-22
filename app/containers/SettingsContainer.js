import React, { Component } from 'react';
import { Button } from '@blueprintjs/core';

import DefaultLocaleMessage from '../components/locale/DefaultLocaleMessage';
import EventTypeAddDialog from '../components/dialog/EventTypeAddDialog';
import Message from '../components/messages/Message';
import Api from '../../lib/core-api-client/ApiV1';

const API = new Api();
const mapEvent = (data) => ({
  default_duration: data.default_duration,
  default_repeat_interval: data.default_repeat_interval,
  description: data.description,
  name: data.name,
  subname: data.subname
});
const errorMessage = (error) => Message.show(`Error #${error.code || '000'}: ${error.message}`, 'error');

export default class SettingsContainer extends Component {
  constructor(props) {
    super(props);

    this.state = { locales: [] };
  }

  componentDidMount() {
    API
      .fetchLocales()
      .then(data => this.setState({ locales: data }))
      .catch(error => console.error(`Couldn't fetch locales data from the server, ${error}`, 'error'));
  }


  handleCreateEventType = () => {
    this.eventTypeAddDialog.toggleDialog();
  }

  handleCreate = (formData) => {
    if (!formData.valid) {
      Message.show('Please check the form data.', 'error');
      return;
    }

    API
      .createEventType(mapEvent(formData))
      .then(result => Message.show(`Event type has been created [${result.id}].`))
      // .then(() => this.props.onRefresh())
      .catch(error => errorMessage(error));
  }

  render() {
    const localeMessage = DefaultLocaleMessage(this.state.locales);

    return (
      <div>
        <EventTypeAddDialog
          ref={(c) => { this.eventTypeAddDialog = c; }}
          callback={this.handleCreate}
        />
        <p>Settings</p>
        <div className="pt-tag pt-minimal pt-intent-primary">
          {localeMessage}
        </div>
        <p>
          <Button className="pt-minimal" iconName="add" text="Create new event type" onClick={this.handleCreateEventType} />
        </p>
      </div>);
  }
}
