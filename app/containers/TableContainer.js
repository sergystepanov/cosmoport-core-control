// @flow
import React, {Component} from 'react';

import {Message} from '../components/messages/Message';
import Api from '../../lib/core-api-client/ApiV1';
import Table from '../components/table/Table';

export default class TableContainer extends Component {
  constructor(props) {
    super(props);

    this.api = new Api();

    this.state = {
      events: [],
      refs: []
    };
  }

  getData() {
    this
      .api
      .fetchReferenceData((data) => {
        this.setState({refs: data});
        this.getEvents();
        Message.show({message: 'Got reference data.'});
      }, (error) => {
        Message.show({message: `Couldn't fetch reference data from the server, ${error}`, intent: Intent.DANGER});
      });
  }

  getEvents() {
    this
      .api
      .fetchTimetable((data) => {
        this.setState({events: data});
        Message.show({message: 'Data has been fetched from the server successfully.'});
      }, (error) => {
        Message.show({message: `Couldn't fetch data from the server, ${error}`, intent: Intent.DANGER});
      });
  }

  componentDidMount() {
    this.getData();
  }

  render() {
    return (<Table events={this.state.events} refs={this.state.refs}/>);
  }
}
