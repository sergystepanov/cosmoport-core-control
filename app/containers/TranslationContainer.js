// @flow
import React, {Component} from 'react';
import {Button, Intent} from '@blueprintjs/core';

import {Message} from '../components/messages/Message';
import Translation from '../components/translation/Translation';
import TranslationTable from '../components/translation/TranslationTable';
import LocaleAddDialog from '../components/dialog/LocaleAddDialog';
import Api from '../../lib/core-api-client/ApiV1';

export default class TranslationContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      locales: [],
      translations: {},
      currentTranslation: ''
    };
  }

  componentDidMount() {
    this.fetchLocales();
  }

  fetchLocales = () => {
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

  handleTextChange = (id, value, okCallback, notOkCallback) => {
    const api = new Api();

    const valueObject = {
      text: value
    };
    console.log(id, value, okCallback, notOkCallback);

    api.updateTranslationTextForId(id, valueObject, (data) => {
      Message.show({message: 'Translation value has been saved successfully.'});
      okCallback();
    }, (error) => {
      Message.show({message: `Couldn't save translation value, ${error}`, intent: Intent.DANGER});
      notOkCallback();
    });
  }

  handleAddClick = (e) => {
    this
      .refs
      .locale_add_dialog
      .toggleDialog();
  }

  handleLocaleCreate = (data) => {
    const api = new Api();

    api.createLocale({
      code: data.code,
      locale_description: data.description
    }, (data) => {
      Message.show({message: 'Locale has been created.'});
      this
        .refs
        .locale_add_dialog
        .toggleDialog();

      this.fetchLocales();
    }, (error) => {
      Message.show({
        message: "An error occured, " + error,
        intent: Intent.DANGER
      });
    });
  }

  render() {
    return (
      <div>
        <LocaleAddDialog ref="locale_add_dialog" callback={this.handleLocaleCreate}/>
        <Translation
          locales={this.state.locales}
          onLocaleSelect={this.handleLocaleSelect}/>
        <Button className="pt-minimal" iconName="add" onClick={this.handleAddClick}/>
        <TranslationTable
          translation={this.state.translations}
          onTextChange={this.handleTextChange}/>
      </div>
    );
  }
}
