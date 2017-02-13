// @flow
import React, {Component} from 'react';
import {Intent} from '@blueprintjs/core';

import {Message} from '../components/messages/Message';
import Translation from '../components/translation/Translation';
import TranslationTable from '../components/translation/TranslationTable';
import Api from '../../lib/core-api-client/ApiV1';

export default class MainPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      locales: [],
      translations: {},
      currentTranslation: ''
    };
  }

  componentDidMount() {
    const api = new Api();

    api.fetchLocales((data) => {
      this.setState({locales: data});
      Message.show({message: 'Locales data has been fetched from the server successfully.'});
    }, (error) => {
      Message.show({message: `Couldn't fetch locales data from the server, ${error}`, intent: Intent.DANGER});
    });
  }

  handleLocaleSelect = (locale) => {
    const api = new Api();

    api.fetchTranslationsForLocale(locale, (data) => {
      this.setState({translations: data, currentTranslation: locale});
      console.log(data);
      Message.show({message: 'Translations data has been fetched from the server successfully.'});
    }, (error) => {
      Message.show({message: `Couldn't fetch translations data from the server, ${error}`, intent: Intent.DANGER});
    });
  }

  render() {
    return (
      <div>
        <Translation
          locales={this.state.locales}
          onLocaleSelect={this.handleLocaleSelect}/>
        <TranslationTable
          translation={this.state.translations}/>
      </div>
    );
  }
}
