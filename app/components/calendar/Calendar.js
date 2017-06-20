// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';

import L18n from '../l18n/L18n';
import _date from '../date/_date';
import EventPropType from '../../props/EventPropType';
import RefsPropType from '../../props/RefsPropType';
import LocalePropType from '../../props/LocalePropType';

require('fullcalendar/dist/fullcalendar.min.js');

/**
 * Hybrid React/Fullcalendar component.
 *
 * @since 0.1.0
 */
export default class Calendar extends Component {
  static propTypes = {
    events: PropTypes.arrayOf(EventPropType),
    locale: LocalePropType.isRequired,
    refs: RefsPropType.isRequired
  }

  static defaultProps = {
    events: []
  }

  constructor(props) {
    super(props);

    this.events = [];
  }

  componentDidMount() {
    this.$node = $(this.calendar);
    const self = this;

    this.$node.fullCalendar({
      height: 'auto',
      header: {
        left: '',
        center: 'title',
        right: 'prev,next today,month,agendaWeek,agendaDay'
      },
      defaultView: 'month',
      timeFormat: 'HH:mm',
      // starts from Monday
      firstDay: 1,
      // eventLimit: true,
      allDaySlot: false,
      slotDuration: '00:30:00',
      slotLabelFormat: 'HH:mm',
      slotEventOverlap: false,
      eventSources: [{ events: this.getEvents }],
      navLinks: true,
      selectable: false,
      selectHelper: false,
      dayClick: self.handleDayClick,
      eventClick: self.handleEventClick,
      editable: false
    });
  }

  /**
   * Each time when component receives new props, we should trigger refresh or
   * perform anything else we need. For this example, we'll update only the
   * enable/disable option, as soon as we receive a different value for
   * this.props.enable if (nextProps.enable !== this.props.enable) { }
   *
   * @param {*} nextProps The properties of the object.
   */
  componentWillReceiveProps(nextProps) {
    this.events = nextProps.events;
    this.l18n = new L18n(nextProps.locale, nextProps.refs);
    this.$node.fullCalendar('refetchEvents');
  }

  shouldComponentUpdate() {
    return false;
  }

  /**
   * Removes elements, events handlers, and internal data
   * when the component will unmount.
   *
   * @since 0.1.0
   */
  componentWillUnmount() {
    this.$node.fullCalendar('destroy');
  }

  handleDayClick = (date, jsEvent, view) => {
    console.log(date.format(), view.name);
  }

  handleEventClick = (calEvent, jsEvent, view) => {
    console.log(calEvent.title, view.name);
  }

  getEvents = (start, end, timezone, callback) => {
    const events = this.events.map(event => {
      const eventData = this.l18n.findEventRefByEventTypeId(event.eventTypeId);

      return {
        title: `${this.l18n.findTranslationById(eventData, 'i18nEventTypeName')} / ${this
          .l18n
          .findTranslationById(eventData, 'i18nEventTypeSubname')}`,
        start: `${event
          .eventDate}T${_date.minutesToHm(event.startTime)}`,
        end: `${event.eventDate}T${_date.minutesToHm(event.startTime + event.durationTime)}`
      };
    });

    callback(events);
  }


  render() {
    return <div ref={(div) => { this.calendar = div; }} />;
  }
}
