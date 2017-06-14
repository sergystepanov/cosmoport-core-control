import React, { Component, PropTypes } from 'react';

import PageCaption from '../components/page/PageCaption';
import Table from '../components/table/Table';
import Api from '../../lib/core-api-client/ApiV1';
import ApiError from '../components/indicators/ApiError';
import EventMapper from '../components/mapper/EventMapper';
import Message from '../components/messages/Message';
import _date from '../components/date/_date';

export default class TableContainer extends Component {
  static propTypes = {
    api: PropTypes.instanceOf(Api)
  }

  static defaultProps = {
    api: null
  }

  constructor(props) {
    super(props);

    this.state = { events: [], locale: {}, refs: {}, gates: [] };
  }

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    Promise.all([
      this.props.api.fetchReferenceData(),
      this.props.api.fetchTranslations(),
      this.props.api.fetchTimetable(),
      this.props.api.fetchGates()
    ])
      .then(data => this.setState(
        { refs: data[0], locale: data[1].en, events: data[2], gates: data[3] })
      )
      .catch(error => ApiError(error));
  }

  handleCreate = (formData) => {
    this.props.api
      .createEvent(EventMapper.fromForm(formData))
      .then(result => Message.show(`Event has been created [${result.id}].`))
      .then(() => this.handleRefresh())
      .catch(error => ApiError(error));
  }

  handleEdit = (formData) => {
    this.props.api
      .updateEvent(EventMapper.fromForm(formData))
      .then(result => Message.show(`Event has been updated [${result.id}].`))
      .then(() => this.handleRefresh())
      .catch(error => ApiError(error));
  }

  handleDelete = (id) => {
    this.props.api
      .deleteEvent(id)
      .then((result) => Message.show(`Deleted ${result.deleted}.`))
      .then(() => this.handleRefresh())
      .catch(error => ApiError(error));
  }

  handleRefresh = () => this.getData()

  handleDateChange = (range) => {
    this.props.api.get(`/timetable?date=${range[0] ? _date.toYmd(range[0]) : ''}&date2=${range[1] ? _date.toYmd(range[1]) : ''}`)
      .then(data => this.setState({ events: data }))
      .catch(error => ApiError(error));
  }

  render() {
    const { events, refs, locale, gates } = this.state;

    return (
      <div>
        <PageCaption text="03 Timetable" />
        <Table
          events={events}
          refs={refs}
          locale={locale}
          gates={gates}
          onDateRangeChange={this.handleDateChange}
          onCreate={this.handleCreate}
          onEdit={this.handleEdit}
          onDelete={this.handleDelete}
          onRefresh={this.handleRefresh}
          auth={this.props.auth}
        />
      </div>
    );
  }
}
