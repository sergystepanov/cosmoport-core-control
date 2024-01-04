import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Table from '../components/table/Table';
import { Api } from 'cosmoport-core-api-client';
import Message from '../components/messages/Message';
import _date from '../components/date/_date';

export default class TableContainer extends Component {
  static propTypes = {
    api: PropTypes.instanceOf(Api).isRequired,
    auth: PropTypes.bool,
    onRefresh: PropTypes.func,
    pre: PropTypes.number.isRequired,
  };

  static defaultProps = {
    auth: false,
    onRefresh: () => {},
  };

  state = {
    hasData: false,
    events: [],
    locale: {},
    refs: {},
    gates: [],
    defaultRange: _date.getThreeDaysRange(),
    range: _date.getThreeDaysRange(),
  };

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    Promise.all([
      this.props.api.fetchReferenceData(),
      this.props.api.fetchTranslations(),
      this.apiGetEventInRange(this.state.range),
      this.props.api.fetchGates(),
    ])
      .then((data) =>
        this.setState({
          hasData: true,
          refs: data[0],
          locale: data[1].en,
          events: data[2],
          gates: data[3],
        }),
      )
      .catch(console.error);
  };

  handleCreate = (formData, suggester) => {
    this.props.api
      .createEvent(formData)
      .then((result) => Message.show(`Event has been created [${result.id}].`))
      .then(() => suggester && suggester(this.props.pre))
      .then(() => this.handleRefresh())
      .catch(console.error);
  };

  handleEdit = (formData) => {
    this.props.api
      .updateEvent(formData)
      .then((result) => Message.show(`Event has been updated [${result.id}].`))
      .then(() => this.handleRefresh())
      .catch(console.error);
  };

  handleDelete = (id) => {
    this.props.api
      .deleteEvent(id)
      .then((result) => Message.show(`Deleted ${result.deleted}.`))
      .then(() => this.handleRefresh())
      .catch(console.error);
  };

  handleRefresh = () => {
    this.getData();
    this.props.onRefresh();
  };

  handleDateChange = (range_) => {
    this.apiGetEventInRange(range_)
      .then((data) => this.setState({ events: data, range: range_ }))
      .catch(console.error);
  };

  handleDateClear = () => {
    this.handleDateChange(this.state.defaultRange);
  };

  apiGetEventInRange = (range) =>
    this.props.api.get(
      `/timetable?date=${range[0] ? _date.toYmd(range[0]) : ''}&date2=${
        range[1] ? _date.toYmd(range[1]) : ''
      }`,
    );

  render() {
    const { events, refs, locale, gates, range, hasData } = this.state;

    return hasData ? (
      <Table
        auth={this.props.auth}
        defaultRange={this.state.defaultRange}
        events={events}
        gates={gates}
        locale={locale}
        onCreate={this.handleCreate}
        onDateRangeChange={this.handleDateChange}
        onDateRangeClear={this.handleDateClear}
        onDelete={this.handleDelete}
        onEdit={this.handleEdit}
        onRefresh={this.handleRefresh}
        range={range}
        refs={refs}
      />
    ) : (
      'Loading...'
    );
  }
}
