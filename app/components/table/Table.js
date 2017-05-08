import React, { Component } from 'react';
import { Button } from '@blueprintjs/core';

import Message from '../../components/messages/Message';
import EventAddDialog from '../dialog/EventAddDialog';
import EventEditDialog from '../dialog/EventEditDialog';
import EventDeleteAlert from '../dialog/EventDeleteAlert';
import EventTable from '../eventTable/EventTable';

export default class Table extends Component {
  handleCreate = (formData) => {
    if (!formData.valid) {
      Message.show('Please check the form data.', 'error');
      return;
    }

    this.props.onCreate(formData);
  }

  handleAddClick = () => {
    this.refs.event_add_dialog.toggleDialog();
  }

  handleRefresh = () => {
    this.props.onRefresh();
  }

  handlePreDelete = (id) => {
    this.refs.delete_alert.open(id);
  }

  handleEdit = (event) => {
    this.refs.event_edit_dialog.edit(event);
  }

  handleEditApply = (formData) => {
     if (!formData.valid) {
      Message.show('Please check the form data.', 'error');
      return;
    }

    this.props.onEdit(formData);
  }

  handleDelete = (id) => {
    this.props.onDelete(id);
  }

  render() {
    const { refs, locale, events } = this.props;

    return (
      <div>
        <EventDeleteAlert ref="delete_alert" onConfirm={this.handleDelete} />
        <EventAddDialog ref="event_add_dialog" callback={this.handleCreate} refs={refs} locale={locale} />
        <EventEditDialog ref="event_edit_dialog" callback={this.handleEditApply} refs={refs} locale={locale} />
        <div>
          <Button className="pt-minimal" iconName="add" onClick={this.handleAddClick} />
          <Button className="pt-minimal" iconName="refresh" onClick={this.handleRefresh} />
        </div>
        <EventTable editCallback={this.handleEdit} callback={this.handlePreDelete} refs={refs} locale={locale} events={events} />
      </div>
    );
  }
}
