import React, { Component } from 'react';
import { Button } from '@blueprintjs/core';

import Api from '../../lib/core-api-client/ApiV1';

const API = new Api();

const defaultLocaleMessage = (locales) => {
  if (locales.length < 1) {
    return '';
  }

  let defaultLocale = false;
  const rest = [];
  locales.forEach(locale => {
    if (locale.defaultLocale) {
      defaultLocale = locale;
    } else {
      rest.push(locale);
    }
  });

  let restText = '';
  let sep = '';
  rest.forEach(locale => {
    restText += `${sep}${locale.code} (${locale.localeDescription})`;
    sep = ', ';
  });

  return `Default locale is ${defaultLocale.code} (${defaultLocale.localeDescription}) and the rest are ${restText}.`;
};

export default class SettingsContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {locales: []};
  }

  handleCreateEventType = () => {

  }

  componentDidMount() {
    API
      .fetchLocales()
      .then(data => this.setState({ locales: data }))
      .catch(error => console.error(`Couldn't fetch locales data from the server, ${error}`, 'error'));
  }

  render() {
    const localeMessage = defaultLocaleMessage(this.state.locales);


    return (
      <div>
        <p>Settings</p>
        <div className="pt-tag pt-minimal pt-intent-primary">
          {localeMessage}
        </div>
        <p>
          <Button className="pt-minimal" iconName="add" text="Create event type" onClick={this.handleCreateEventType} />
        </p>
      </div>);
  }
}
