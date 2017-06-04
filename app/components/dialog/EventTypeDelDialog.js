import React, { Component, PropTypes } from 'react';
import { Dialog, Colors } from '@blueprintjs/core';

import L18n from '../../components/l18n/L18n';

/**
 * The class for event type add dialog.
 *
 * @since 0.1.0
 */
export default class EventTypeDelDialog extends Component {
  static propTypes = { callback: PropTypes.func.isRequired }
  static defaultProps = { callback: () => { } }

  constructor(props) {
    super(props);

    this.state = { isOpen: false, types: [], refs: {}, tr: {} };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
      this.setState({ types: nextProps.refs.types, refs: nextProps.refs, tr: nextProps.trans });
    }
  }

  toggleDialog = () => {
    this.setState({ isOpen: !this.state.isOpen });
  }

  onDelete = (id) => {
    this.props.callback(id, this.onSuccess);
  }

  onSuccess = () => {
    this.toggleDialog();
  }

  render() {
    if (!this.state.types) {
      return <div>:(</div>;
    }

    const l18n = new L18n(this.state.tr, this.state.refs);
    const eventTypes = this.state.types.map(op =>
      <div key={op.id}>
        {l18n.findTranslationById(op, 'i18nEventTypeName')}&nbsp;/&nbsp;{l18n.findTranslationById(op, 'i18nEventTypeSubname')}
        <button type="button" className="pt-button pt-minimal pt-icon-remove pt-intent-danger" onClick={this.onDelete.bind(this, op.id)} />
      </div>
    );

    return (
      <Dialog isOpen={this.state.isOpen} onClose={this.toggleDialog} canOutsideClickClose={false} title="Delete an event type">
        <div className="pt-dialog-body">
          <div className="pt-callout">
            Click on the button (<span className="pt-icon-remove" />) bellow to delete right away an event type.
            <div style={{ color: Colors.RED1 }}>The application does allow to delete event types which are used in existing events.</div>
          </div>
          <p>&nbsp;</p>
          {eventTypes}
        </div>
      </Dialog>
    );
  }
}
