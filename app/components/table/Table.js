// @flow
import React, {Component} from 'react';
import {Button, Intent} from '@blueprintjs/core';

import EventAddDialog from '../dialog/EventAddDialog';
import EventTable from '../eventTable/EventTable';

export default class Table extends Component {

  handleCreate = (formData) => {
    // this   .api   .addEvent(formData, (data) => {     Message.show({message:
    // "Event has been saved."});     this       .refs       .event_add_dialog
    // .toggleDialog();     this.getTableData();   }, (error) => { Message.show({
    // message: "An error occured, " + error,       intent: Intent.DANGER     }) });
  }

  handleAddClick = () => {
    // this.setState({isItOpen: true});

    this
      .refs
      .event_add_dialog
      .toggleDialog();
  }

  handleRefreshClick = () => {
    this.getReferenceData();
  }

  handleRowRemove = (id) => {
    // this   .api   .deleteEvent(id, (data) => {     Message.show({message: "The
    // event has been deleted."});     this.getTableData();   }, () =>
    // Message.show({message: "Couldn't delete the event.", intent: Intent.DANGER}));
  }

  render() {
    return (
      <div>
        <EventAddDialog ref="event_add_dialog" callback={this.handleCreate} refs={this.props.refs} locale={this.props.locale}/>
        <div>
          <Button className="pt-minimal" iconName="add" onClick={this.handleAddClick}/>
          <Button
            className="pt-minimal"
            iconName="refresh"
            onClick={this.handleRefreshClick}/>
        </div>
        <EventTable
          callback={this.handleRowRemove}
          refs={this.props.refs}
          locale={this.props.locale}
          events={this.props.events}/>
      </div>
    );
  }
}
