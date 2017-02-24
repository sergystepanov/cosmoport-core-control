// @flow
import React, {Component} from 'react';
import $ from 'jquery';

require('fullcalendar/dist/fullcalendar.min.js');

export default class Calendar extends Component {
  constructor(props) {
    super(props);

    this.events = [];
  }

  componentDidMount() {
    this.$node = $(this.refs.calendar);

    this
      .$node
      .fullCalendar({
        header: {
          left: 'prev,next today',
          center: 'title',
          right: 'month,basicWeek,basicDay'
        },
        eventLimit: true,
        eventSources: [
          {
            events: this.getEvents
          }
        ]
      });
  }

  componentWillReceiveProps(nextProps) {
    // Each time when component receives new props, we should trigger refresh or
    // perform anything else we need. For this example, we'll update only the
    // enable/disable option, as soon as we receive a different value for
    // this.props.enable if (nextProps.enable !== this.props.enable) {
    // this.$node.sortable(nextProps.enable ? 'enable' : 'disable'); } if
    // (nextProps.events) {
    this.events = nextProps.events;
    this
      .$node
      .fullCalendar('refetchEvents');
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillUnmount() {
    // Clean up the mess when the component unmounts this.$node.sortable('destroy');
  }

  getEvents = (start, end, timezone, callback) => {
    let events = [];

    for (const event of this.events) {
      events.push({
        title: `Event type: ${event.eventTypeId}`,
        start: event.eventDate + 'T00:00:00',
        end: event.eventDate + 'T10:10:10'
      });
    }

    callback(events);
  }

  props : {
    events: array
  }

  render() {
    return (<div ref="calendar"/>);
  }
}
