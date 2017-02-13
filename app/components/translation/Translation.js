// @flow
import React, {Component} from 'react';
import {Tag} from '@blueprintjs/core';

import styles from './Translation.css';

export default class Translation extends Component {
  handleClick = (e) => {
    e.preventDefault();

    this
      .props
      .onLocaleSelect('en');
  }

  renderLocale = ({id, code, defaultLocale, localeDescription}) => (
    <Tag key={id} className={styles.localeTag} onClick={this.handleClick}>
      {code}&nbsp;({localeDescription})
    </Tag>
  );

  render() {
    return (
      <div>
        <h3>translations</h3>
        <div>{this
            .props
            .locales
            .map(this.renderLocale)}</div>
      </div>
    );
  }
}
