// @flow
import React, {Component} from 'react';

export default class TranslationTable extends Component {
  constructor(props) {
    super(props);

    this.renderTable = this
      .renderTable
      .bind(this);
  }

  renderTable = (data) => {
    console.log('Data is: ' + data);
  }

  render() {
    return (
      <div>
        <h3>-----</h3>
        <div>{this.renderTable(this.props.translation)}</div>
      </div>
    );
  }
}
