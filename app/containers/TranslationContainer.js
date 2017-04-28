// @flow
import React, { Component } from 'react';
import { Button } from '@blueprintjs/core';

import PageCaption from '../components/page/PageCaption';
import Message from '../components/messages/Message';
import Translation from '../components/translation/Translation';
import TranslationTable from '../components/translation/TranslationTable';
import LocaleAddDialog from '../components/dialog/LocaleAddDialog';
import Api from '../../lib/core-api-client/ApiV1';

import styles from './App.css';

const API = new Api();

export default class TranslationContainer extends Component {
  constructor(props) {
    super(props);

    this.state = { locales: [], translations: {}, currentTranslation: '' };
  }

  componentDidMount() {
    this.fetchLocales();
  }

  fetchLocales = () => {
    API
      .fetchLocales()
      .then(data => this.setState({ locales: data }))
      .catch(error => Message.show(`Couldn't fetch locales data from the server, ${error}`, 'error'));
  }

  handleLocaleSelect = (locale) => {
    API
      .fetchTranslationsForLocale(locale)
      .then(data => this.setState({ translations: data, currentTranslation: locale }))
      .catch(error => Message.show(`Couldn't fetch translations data from the server, ${error}`, 'error'));
  }

  handleTextChange = (id, value, okCallback, notOkCallback) => {
    const valueObject = { text: value };

    API
      .updateTranslationTextForId(id, valueObject)
      .then(Message.show('Translation value has been saved successfully.'))
      .then(okCallback)
      .catch(error => {
        Message.show(`Couldn't save translation value, ${error}`, 'error');
        notOkCallback();
      });
  }

  handleAddClick = () => {
    this.refs.locale_add_dialog.toggleDialog();
  }

  handleLocaleCreate = (data) => {
    API
      .createLocale({ code: data.code, locale_description: data.description })
      .then(Message.show('Locale has been created.'))
      .then(this.refs.locale_add_dialog.toggleDialog)
      .then(this.fetchLocales)
      .catch(error => Message.show(`An error occured, ${error}`, 'error'));
  }

  render() {
    return (
      <div>
        <PageCaption text="04 Translations" />
        <LocaleAddDialog ref="locale_add_dialog" callback={this.handleLocaleCreate} />
        <div className={styles.inlineContainer}>
          <Translation
            locales={this.state.locales}
            onLocaleSelect={this.handleLocaleSelect}
          />
          <Button className="pt-minimal" iconName="add" onClick={this.handleAddClick} />
        </div>
        <TranslationTable
          translation={this.state.translations}
          onTextChange={this.handleTextChange}
        />
      </div>
    );
  }
}
