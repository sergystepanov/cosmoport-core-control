// @flow
import React, { Component } from 'react';
import $ from 'jquery';

import L18n from '../l18n/L18n';

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
        timeFormat: 'HH:mm',
        // eventLimit: true,
        eventSources: [
          {
            events: this.getEvents
          }
        ],
        navLinks: true, // can click day/week names to navigate views
        selectable: true,
        selectHelper: true,
        select: function (start, end) {
          var title = prompt('Event Title:');
          var eventData;
          if (title) {
            eventData = {
              title: title,
              start: start,
              end: end
            };
            this
              .$node
              .fullCalendar('renderEvent', eventData, true); // stick? = true
          }
          this
            .$node
            .fullCalendar('unselect');
        },
        editable: true,

        dayClick(date, jsEvent, view) {
          // alert('Clicked on: ' + date.format()); alert('Coordinates: ' + jsEvent.pageX
          // + ',' + jsEvent.pageY); alert('Current view: ' + view.name); change the day's
          // background color just for fun $(this).css('background-color', 'red');
        }
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
    this.l18n = new L18n(nextProps.locale, nextProps.refs);
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
    const events = [];

    for (const event of this.events) {
      const eventData = this
        .l18n
        .findEventRefByEventTypeId(event.eventTypeId);
      events.push({
        title: `${this
          .l18n
          .findTranslationById(eventData, 'i18nEventTypeName')} / ${this
          .l18n
          .findTranslationById(eventData, 'i18nEventTypeSubname')}`,
        start: `${event
          .eventDate}T${this
          .minutesToHm(event.startTime)}`,
        end: `${event
          .eventDate}T${this
          .minutesToHm(event.startTime + event.durationTime)}`
      });
    }

    callback(events);
  }

  minutesToHm(minutes) {
    if (minutes < 0) {
      return '00:00:00';
    }

    const h = Math.trunc(minutes / 60);
    const m = minutes % 60;

    return `${h < 10
      ? '0' + h
      : h}:${m < 10
        ? '0' + m
        : m}:00`;
  }

  props : {
    events: array,
    locale: object,
    refs: object
  }

  render() {
    return (<div ref="calendar"/>);
  }
}
