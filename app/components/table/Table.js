import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@blueprintjs/core';
import { DateRangeInput } from '@blueprintjs/datetime';

import RefsPropType from '../../props/RefsPropType';
import LocalePropType from '../../props/LocalePropType';
import EventPropType from '../../props/EventPropType';
import GatePropType from '../../props/GatePropType';
import Message from '../../components/messages/Message';
import EventAddDialog from '../dialog/EventAddDialog';
import EventEditDialog from '../dialog/EventEditDialog';
import EventDeleteAlert from '../dialog/EventDeleteAlert';
import EventTable from '../eventTable/EventTable';

export default class Table extends Component {
  static propTypes = {
    onCreate: PropTypes.func,
    onRefresh: PropTypes.func,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
    onDateRangeChange: PropTypes.func,
    refs: RefsPropType.isRequired,
    locale: LocalePropType.isRequired,
    events: PropTypes.arrayOf(EventPropType),
    gates: PropTypes.arrayOf(GatePropType),
    auth: PropTypes.bool,
    defaultRange: PropTypes.arrayOf(PropTypes.instanceOf(Date))
  }

  static defaultProps = {
    onCreate: () => { },
    onRefresh: () => { },
    onEdit: () => { },
    onDelete: () => { },
    onDateRangeChange: () => { },
    events: [],
    gates: [],
    auth: false,
    defaultRange: [null, null]
  }

  constructor(props) {
    super(props);

    this.state = { range: props.defaultRange };
  }

  handleCreate = (formData, valid) => {
    if (!valid) {
      Message.show('Please check the form data.', 'error');
      return;
    }

    this.props.onCreate(formData);
  }

  handleAddClick = () => {
    this.eventAddDialog.toggleDialog();
  }

  handleRefresh = () => this.props.onRefresh(this.state.range)

  handlePreDelete = (id) => this.deleteAlert.open(id)

  handleEdit = (event) => {
    this.eventEditDialog.edit(event);
  }

  handleEditApply = (formData, valid) => {
    if (!valid) {
      Message.show('Please check the form data.', 'error');
      return;
    }

    this.props.onEdit(formData);
  }

  handleDelete = (id) => {
    this.props.onDelete(id);
  }

  handleChange = (range_) => {
    this.props.onDateRangeChange(range_);
    this.setState({ range: range_ });
  }

  handleClearRange = () => {
    this.props.onDateRangeChange(this.props.defaultRange);
    this.setState({ range: this.props.defaultRange });
  }

  render() {
    const { range } = this.state;
    const { refs, locale, events, gates, auth } = this.props;

    return (
      <div>
        <EventDeleteAlert
          ref={(alert) => { this.deleteAlert = alert; }}
          onConfirm={this.handleDelete}
        />
        <EventAddDialog
          ref={(dialog) => { this.eventAddDialog = dialog; }}
          callback={this.handleCreate}
          refs={refs}
          locale={locale}
          gates={gates}
        />
        <EventEditDialog
          ref={(dialog) => { this.eventEditDialog = dialog; }}
          callback={this.handleEditApply}
          refs={refs}
          locale={locale}
          gates={gates}
        />
        <div>
          <Button className="pt-minimal" iconName="add" onClick={this.handleAddClick} />
          <Button className="pt-minimal" iconName="refresh" onClick={this.handleRefresh} />
          <div>
            <DateRangeInput value={range} onChange={this.handleChange} />
            <Button className="pt-minimal" iconName="remove" onClick={this.handleClearRange} />
          </div>
        </div>
        <EventTable
          editCallback={this.handleEdit}
          callback={this.handlePreDelete}
          refs={refs}
          locale={locale}
          events={events}
          auth={auth}
        />
      </div>
    );
  }
}
