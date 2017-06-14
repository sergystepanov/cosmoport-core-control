import React, { Component } from 'react';
import { Button } from '@blueprintjs/core';
import { DateRangeInput } from '@blueprintjs/datetime';

import Message from '../../components/messages/Message';
import EventAddDialog from '../dialog/EventAddDialog';
import EventEditDialog from '../dialog/EventEditDialog';
import EventDeleteAlert from '../dialog/EventDeleteAlert';
import EventTable from '../eventTable/EventTable';

export default class Table extends Component {
  constructor(props) {
    super(props);

    this.state = { range: [null, null] };
  }

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
    this.setState({ range: [null, null] });
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

  handleChange = (rangee) => {
    this.props.onDateRangeChange(rangee);
    this.setState({ range: rangee });
  }

  handleClearRange = () => {
    this.props.onDateRangeChange([null, null]);
    this.setState({ range: [null, null] });
  }

  render() {
    const { range } = this.state;
    const { refs, locale, events, gates } = this.props;

    return (
      <div>
        <EventDeleteAlert ref="delete_alert" onConfirm={this.handleDelete} />
        <EventAddDialog ref="event_add_dialog" callback={this.handleCreate} refs={refs} locale={locale} gates={gates} />
        <EventEditDialog ref="event_edit_dialog" callback={this.handleEditApply} refs={refs} locale={locale} gates={gates} />
        <div>
          <Button className="pt-minimal" iconName="add" onClick={this.handleAddClick} />
          <Button className="pt-minimal" iconName="refresh" onClick={this.handleRefresh} />
          <div>
            <DateRangeInput value={range} onChange={this.handleChange} />
            <Button className="pt-minimal" iconName="remove" onClick={this.handleClearRange} />
          </div>
        </div>
        <EventTable editCallback={this.handleEdit} callback={this.handlePreDelete} refs={refs} locale={locale} events={events} auth={this.props.auth} />
      </div>
    );
  }
}
