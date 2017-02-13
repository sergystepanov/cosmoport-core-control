// @flow
import React, {Component} from 'react';

export default class TranslationTable extends Component {
  constructor(props) {
    super(props);

    this.renderTable = this
      .renderTable
      .bind(this);
  }

  renderTable(tr) {
    if (tr !== undefined && tr.length > 0) {

      let rows = [];


      tr
        .forEach((dat) => {
          rows.push(
            <tr key={dat.id}>
              <td>{dat.id}</td>
              <td>{dat.text}</td>
              <td>{dat.i18n.tag}</td>
              <td>{dat.i18n.description}</td>
              <td>{dat.i18n.params}</td>
              <td>{dat.i18n.external}</td>
            </tr>
          );
        }, this);

        console.log(rows);

      return (
        <table className="pt-table">
          <thead>
            <th>#</th>
            <th>Text</th>
            <th>Tag</th>
            <th>Description</th>
            <th>Params</th>
            <th>External</th>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
      );
    }
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
