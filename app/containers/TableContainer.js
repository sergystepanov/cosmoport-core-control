// @flow
import React, { Component } from 'react';

import Message from '../components/messages/Message';
import Table from '../components/table/Table';
import Api from '../../lib/core-api-client/ApiV1';

const API = new Api();

export default class TableContainer extends Component {
  constructor(props) {
    super(props);

    this.state = { events: [], locale: {}, refs: {} };
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    Promise.all([
      API
        .fetchReferenceData()
        .then(data => this.setState({ refs: data })),
      API
        .fetchTranslations()
        .then(translations => this.setState({ locale: translations.en })),
      API
        .fetchTimetable()
        .then(data => this.setState({ events: data })),
      API
        .fetchEvents()
        .then(data => this.setState({ events: data }))
    ])
      .then(Message.show('Data has been fetched from the server successfully.'))
      .catch(error => Message.show(`Couldn't fetch data from the server, ${error}`, 'error'));
  }

  handleRefresh = () => this.getData()

  render() {
    return (
      <Table
        events={this.state.events}
        refs={this.state.refs}
        locale={this.state.locale}
        onRefresh={this.handleRefresh}
      />
    );
  }
}
