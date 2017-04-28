// @flow
import React, { Component } from 'react';
import { EditableText, Tag, Intent } from '@blueprintjs/core';

export default class TranslationTable extends Component {
  onSaveOk = () => {
    console.log('ok');
  }

  onSaveFail = () => {
    console.log('not ok');
  }

  handleTextChange = (id, oldValue, value) => {
    if (value === oldValue) {
      return;
    }

    this.props.onTextChange(id, value, this.onSaveOk, this.onSaveFail);
  }

  renderTable = (tr) => {
    if (tr !== undefined && tr.length > 0) {
      let rows = [];

      const renderExternalTag = function (isExternal) {
        if (isExternal) {
          return <Tag className="pt-minimal">external</Tag>;
        }
      };

      const renderParamsTag = function (params) {
        if (params) {
          return <Tag intent={Intent.WARNING} className="pt-minimal">{params}</Tag>;
        }
      };

      tr.forEach((dat) => {
        rows.push(
          <tr key={dat.id}>
            <td>{dat.id}</td>
            <td>
              <EditableText
                multiline
                minLines={3}
                maxLines={12}
                defaultValue={dat.text}
                onConfirm={this.handleTextChange.bind(this, dat.id, dat.text)}
              />
            </td>
            <td>{dat.i18n.description}</td>
            <td>
              <Tag className="pt-minimal">{dat.i18n.tag}</Tag>
              {renderParamsTag(dat.i18n.params)}
              {renderExternalTag(dat.i18n.external)}
            </td>
          </tr>
        );
      }, this);

      return (
        <table className="pt-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Text</th>
              <th>Description</th>
              <th>Tags</th>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
      );
    }
  }

  render() {
    return (<div>{this.renderTable(this.props.translation)}</div>);
  }
}
