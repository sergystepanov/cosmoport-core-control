import React, { Component } from 'react';

import $ from 'jquery';

import L18n from '../l18n/L18n';
import _date from '../date/_date';
import { EventType } from '../../types/Types';
import { default as Et } from '../eventType/EventType';

require('fullcalendar/dist/fullcalendar');

const eventTypeColorMap = (type: number) =>
  ({ 1: '#f44336', 2: '#9c27b0', 3: '#2196f3', 4: '#009688' })[type];

type Props = {
  events: EventType[];
  et: ReturnType<typeof Et>;
  l18n: L18n;
  onMenu: (jsEvent: any, calEvent: any, type: string) => void;
  onViewChange: (_: { start: Date; end: Date }) => void;
};

/**
 * Hybrid React/Fullcalendar component.
 *
 * @since 0.1.0
 */
export default class Calendar extends Component<Props> {
  private events: EventType[];
  private calendar: any;
  private $node: any;
  private l18n: L18n | undefined;

  constructor(props: Props) {
    super(props);

    this.events = [];
  }

  componentDidMount() {
    this.$node = $(this.calendar);
    const self = this;

    this.$node.fullCalendar({
      height: 'auto',
      eventLimit: 20,
      // aspectRatio: 1,
      header: {
        left: '',
        center: 'title',
        right: 'prev,next today,month,agendaWeek,agendaDay',
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
      editable: false,
      viewRender: self.handleViewChange,
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
  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    this.events = nextProps.events;
    this.l18n = nextProps.l18n;
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

  handleDayClick = (date: any, jsEvent: any) => {
    this.props.onMenu(jsEvent, date, 'day');
  };

  handleEventClick = (calEvent: any, jsEvent: any) => {
    this.props.onMenu(jsEvent, calEvent, 'event');
  };

  handleViewChange = () => {
    this.props.onViewChange(this.getCurrentDateRange());
  };

  getEvents = (_start: any, _end: any, _timezone: any, callback: any) => {
    const events = this.events.map((event) => {
      const eventData = this.l18n?.findEventRefByEventTypeId(event.eventTypeId);
      const finish = _date.minutesToHm(event.startTime + event.durationTime);

      return {
        id: event.id,
        title: this.props.et.getFullName(eventData),
        start: `${event.eventDate}T${_date.minutesToHm(event.startTime)}`,
        end: `${event.eventDate}T${finish}`,
        color: eventTypeColorMap(event.eventTypeId) || '#defe',
      };
    });

    callback(events);
  };

  getCurrentDateRange = () => {
    const view = this.$node.fullCalendar('getView');
    return { start: view.start, end: view.end };
  };

  render() {
    return (
      <div
        style={{ padding: '0 5em' }}
        ref={(div) => {
          this.calendar = div;
        }}
      />
    );
  }
}
