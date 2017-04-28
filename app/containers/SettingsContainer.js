import React, { Component } from 'react';
import { Button } from '@blueprintjs/core';

import DefaultLocaleMessage from '../components/locale/DefaultLocaleMessage';
import EventTypeAddDialog from '../components/dialog/EventTypeAddDialog';
import Message from '../components/messages/Message';
import Api from '../../lib/core-api-client/ApiV1';
import LocaleInput from '../components/locale/LocaleInput';
import LocaleMapper from '../components/mapper/LocaleMapper';
import RemoteServerAddress from '../components/settings/RemoteAddress';
import PageCaption from '../components/page/PageCaption';

import styles from '../components/settings/Settings.css';

const API = new Api();
const mapEvent = (data) => ({
  default_duration: data.default_duration,
  default_repeat_interval: data.default_repeat_interval,
  description: data.description,
  name: data.name,
  subname: data.subname
});
const errorMessage = (error) => Message.show(`Error #${error.code || '000'}: ${error.message}`, 'error');
const Caption = (props) => <p className={styles.caption}>{props.text}</p>;
const updateLocale = (locale, locales) => {
  const jo = locales.map(l => (l.id === locale.id ? locale : l))
  return jo;
};

export default class SettingsContainer extends Component {
  constructor(props) {
    super(props);

    this.state = { locales: [] };
  }

  componentDidMount() {
    this.fetchLocales();
  }

  fetchLocales = () => {
    API
      .fetchLocales()
      .then(data => this.setState({ locales: data }))
      .catch(error => console.error(`Couldn't fetch locales data from the server, ${error}`, 'error'));
  }

  handleCreateEventType = () => {
    this.eventTypeAddDialog.toggleDialog();
  }

  handleCreate = (formData) => {
    if (!formData.valid) {
      Message.show('Please check the form data.', 'error');
      return;
    }

    API
      .createEventType(mapEvent(formData))
      .then(result => Message.show(`Event type has been created [${result.id}].`))
      // .then(() => this.props.onRefresh())
      .catch(error => errorMessage(error));
  }

  handleLocaleTimeoutChange = (locale, value) => {
    const updated = Object.assign({}, LocaleMapper.map(locale), { show_time: value });

    API
      .updateLocaleShowData(updated)
      .then(result => Message.show(`Locale has been updated [${result.id}].`))
      .then(this.setState(
        { locales: updateLocale(LocaleMapper.unmap(updated), this.state.locales) })
      )
      .catch(error => errorMessage(error));
  }

  handleCheck = (locale, value) => {
    const updated = Object.assign({}, LocaleMapper.map(locale), { show: value });

    API
      .updateLocaleShowData(updated)
      .then(result => Message.show(`Locale has been updated [${result.id}].`))
      .then(this.setState(
        { locales: updateLocale(LocaleMapper.unmap(updated), this.state.locales) })
      )
      .catch(error => errorMessage(error));
  }

  render() {
    const localeMessage = DefaultLocaleMessage(this.state.locales);
    const localeTimeouts = this.state.locales.map(
      locale => <LocaleInput key={locale.id} locale={locale} onChange={this.handleLocaleTimeoutChange} onCheck={this.handleCheck} />
    );

    return (
      <div>
        <EventTypeAddDialog
          ref={(c) => { this.eventTypeAddDialog = c; }}
          callback={this.handleCreate}
        />
        <PageCaption text="05 Settings" />

        <div className={styles.container}>
          <Caption text={'01 Events'} />
          <div>
            <Button className="pt-minimal" text="Create new event type" onClick={this.handleCreateEventType} />
          </div>

          <Caption text={'02 Which locales to show and how long'} />

          <div className={styles.block}>
            {localeMessage}
          </div>

          <div>
            {localeTimeouts}
          </div>

          <Caption text={'03 Remote server address'} />
          <div>
            <RemoteServerAddress />
          </div>
          <p />
        </div>
      </div>);
  }
}
