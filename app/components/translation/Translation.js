// @flow
import React, { Component } from 'react';
import { Tag } from '@blueprintjs/core';

import styles from './Translation.css';

export default class Translation extends Component {
  handleClick = (e) => {
    e.preventDefault();

    this.props.onLocaleSelect(e.target.getAttribute('data-id'));
  }

  renderLocale = ({ id, code, defaultLocale, localeDescription }) => (
    <Tag
      key={id}
      data-id={id}
      className={styles.localeTag}
      onClick={this.handleClick}
    >
      {code}&nbsp;({localeDescription})
    </Tag>
  );

  render() {
    return (
      <div>
        {this.props.locales.map(this.renderLocale)}
      </div>
    );
  }
}
