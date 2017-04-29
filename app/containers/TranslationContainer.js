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
const errorMessage = (error) => Message.show(`Error #${error.code || '000'}: ${error.message}`, 'error');

export default class TranslationContainer extends Component {
  constructor(props) {
    super(props);

    this.state = { locales: [], translations: [], currentTranslation: '' };
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
      .then(() => Message.show('Translation value has been saved successfully.'))
      .then(() => this.updateTranslationStateById(id, value))
      .then(() => okCallback)
      .catch(error => {
        errorMessage(error);
        notOkCallback();
      });
  }

  handleAddClick = () => {
    this.addDialog.toggleDialog();
  }

  handleLocaleCreate = (data) => {
    API
      .createLocale({ code: data.code, locale_description: data.description })
      .then(() => Message.show('Locale has been created.'))
      .then(() => this.addDialog.toggleDialog())
      .then(() => this.fetchLocales())
      .catch(error => errorMessage(error));
  }

  updateTranslationStateById = (id, value) => {
    const ts = this.state.translations;
    const i = ts.findIndex(el => el.id === id);

    if (i > -1) {
      ts[i].text = value;
      this.setState({ translations: ts });
    }
  }

  render() {
    const locales = this.state.locales.map(locale =>
      <Translation key={locale.id} locale={locale} onLocaleSelect={this.handleLocaleSelect} />
    );

    return (
      <div>
        <PageCaption text="04 Translations" />
        <LocaleAddDialog ref={(c) => { this.addDialog = c; }} callback={this.handleLocaleCreate} />
        <div className={styles.inlineContainer}>
          {locales}
          <Button className="pt-minimal" iconName="add" onClick={this.handleAddClick} />
        </div>
        <TranslationTable
          translations={this.state.translations}
          onTextChange={this.handleTextChange}
        />
      </div>
    );
  }
}
