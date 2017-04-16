// @flow
import React, { Component } from 'react';

import Message from '../components/messages/Message';
import Table from '../components/table/Table';
import Api from '../containers/ApiV11';

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
    this.getReferenceData();
  }

  getEvents = () => {
    API
      .fetchEvents()
      .then(data => this.setState({ events: data }))
      .then(Message.show('Data has been fetched from the server successfully.'))
      .catch(error => Message.show(`Couldn't fetch data from the server, ${error}`, 'error'));
  }

  getReferenceData = () => {
    API
      .fetchReferenceData()
      .then(data => this.setState({ refs: data }))
      .then(() => this.getTranslationData())
      .catch(error => console.error(`[refs] fetch, ${error}`));
  }

  getTranslationData = () => {
    API
      .fetchTranslations()
      .then(translations => this.setState({ locale: translations.en }))
      .then(API
        .fetchTimetable()
        .then(data => this.setState({ events: data }))
        .then(() => this.getEvents())
        .catch(error => console.error(`[data] fetch, ${error}`))
      )
      .catch(error => console.error(`[translations] fetch, ${error}`));
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
