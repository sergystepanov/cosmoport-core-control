// @flow
import React, { Component } from 'react';
import { Button } from '@blueprintjs/core';

import Message from '../../components/messages/Message';
import EventAddDialog from '../dialog/EventAddDialog';
import EventTable from '../eventTable/EventTable';
import Api from '../../../lib/core-api-client/ApiV1';

const API = new Api();
const mapEvent = (data) => ({
  id: 0,
  contestants: data.bought,
  cost: data.cost,
  event_date: data.date,
  event_destination_id: data.destination,
  duration_time: data.duration,
  gate_id: data.gate,
  people_limit: data.limit,
  repeat_interval: data.repeat_interval,
  event_status_id: data.status,
  start_time: data.time,
  event_type_id: data.type
});
const errorMessage = (error) => Message.show(`Error #${error.code || '000'}: ${error.message}`, 'error');

export default class Table extends Component {
  handleCreate = (formData) => {
    if (!formData.valid) {
      Message.show('Please check the form data.', 'error');
      return;
    }

    API
      .createEvent(mapEvent(formData))
      .then(result => Message.show(`Event has been created [${result.id}].`))
      .then(() => this.props.onRefresh())
      .catch(error => errorMessage(error));
  }

  handleAddClick = () => {
    this.refs.event_add_dialog.toggleDialog();
  }

  handleRefresh = () => {
    this.props.onRefresh();
  }

  handleDelete = (id) => {
    API
      .deleteEvent(id)
      .then((result) => Message.show(`Deleted ${result.deleted}.`))
      .then(() => this.props.onRefresh())
      .catch(error => errorMessage(error));
  }

  render = () =>
    <div>
      <EventAddDialog ref="event_add_dialog" callback={this.handleCreate} refs={this.props.refs} locale={this.props.locale} />
      <div>
        <Button className="pt-minimal" iconName="add" onClick={this.handleAddClick} />
        <Button className="pt-minimal" iconName="refresh" onClick={this.handleRefresh} />
      </div>
      <EventTable
        callback={this.handleDelete}
        refs={this.props.refs}
        locale={this.props.locale}
        events={this.props.events}
      />
    </div>
}
