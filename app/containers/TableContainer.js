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
      locale: {},
      refs: {}
    };
  }

  getData() {
    this.getReferenceData();
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

  getReferenceData = () => {
    this
      .api
      .fetchReferenceData((data) => {
        this.setState({refs: data});
        this.getTranslationData();
      }, (error) => {
        console.error(`[refs] fetch, ${error}`);
      });
  }

  getTranslationData() {
    this
      .api
      .fetchTranslations((data) => {
        this.setState({locale: data['en']});
        this
          .api
          .fetchTimetable((data) => {
            this.setState({events: data});
            this.getEvents();
          }, (error) => {
            console.error(`[data] fetch, ${error}`);
          });
      }, (error) => {
        console.error(`[translations] fetch, ${error}`);
      });
  }

  componentDidMount() {
    this.getData();
  }

  render() {
    return (<Table events={this.state.events} refs={this.state.refs} locale={this.state.locale}/>);
  }
}
