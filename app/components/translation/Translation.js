import React, { Component } from 'react';
import { Button } from '@blueprintjs/core';

export default class Translation extends Component {
  handleSelect = () => {
    this.props.onLocaleSelect(this.props.locale.id);
  }

  render() {
    const { locale } = this.props;

    return (
      <div>
        <Button key={locale.id} className="pt-minimal" text={`${locale.code} (${locale.localeDescription})`} onClick={this.handleSelect} />
      </div>
    );
  }
}
