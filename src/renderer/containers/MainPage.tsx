import { useEffect, useRef, useState } from 'react';

import moment from 'moment';
import { EventObjectInput } from 'fullcalendar/src/types/input-types';

import Calendar from '../components/calendar/Calendar';
import { Api } from 'cosmoport-core-api-client';
import EventMenu from '../components/calendar/EventMenu';
import EventTicketBuyDialog from '../components/dialog/EventTicketBuyDialog';
import L18n from '../components/l18n/L18n';
import Message from '../components/messages/Message';
import EventAddDialog from '../components/dialog/EventAddDialog';
import _date from '../components/date/_date';
import EventType from '../components/eventType/EventType';
import {
  RefsType,
  EventType as EventType2,
  LocaleType,
  GateType,
} from '../types/Types';

type Props = {
  api: Api;
  onRefresh?: () => void;
  pre?: number;
};

type State = {
  hasData?: boolean;
  isItOpen?: boolean;
  isLoaded?: boolean;
  events: EventType2[];
  locale: LocaleType;
  gates: GateType[];
  refs: RefsType;
  dateRangeStart: string;
  dateRangeEnd: string;
};

export default function MainPage({
  api,
  onRefresh = () => {},
  pre = 10,
}: Props) {
  const [state, setState] = useState<State>({
    isItOpen: false,
    isLoaded: false,
    events: [],
    locale: {},
    refs: {
      destinations: [],
      statuses: [],
      states: [],
      types: [],
      type_categories: [],
    },
    gates: [],
    dateRangeStart: _date.startOfMonth(),
    dateRangeEnd: _date.endOfMonth(),
  });

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    Promise.all([
      api.fetchReferenceData(),
      api.fetchTranslations(),
      // Fetch all the events between the current calendar view range
      api.fetchGates(),
    ])
      .then(([r, l, g]) =>
        setState({
          ...state,
          isLoaded: true,
          refs: r,
          locale: l.en,
          gates: g,
        }),
      )
      .catch(console.error);
  };

  const eventAddDialogRef = useRef<EventAddDialog>(null);
  const eventTicketsDialogRef = useRef<EventTicketBuyDialog>(null);
  const eventMenuRef = useRef<typeof EventMenu>(null);

  const refreshEventsData = (start: string, end: string) => {
    api
      .fetchEventsInRange(start, end)
      .then((result) =>
        setState({
          ...state,
          dateRangeStart: start,
          dateRangeEnd: end,
          events: result,
        }),
      )
      .catch(console.error);
  };

  const handleMenu = (
    event: MouseEvent,
    data: EventObjectInput,
    type: string,
  ) => {
    eventMenuRef.current?.getInstance().show(event, data, type);
  };

  const handleEventTickets = (id: number) => {
    api
      .fetchEventsByIdForGate(id)
      .then((data) => eventTicketsDialogRef.current?.toggle(data[0]))
      .catch(console.error);
  };

  const handleTickets = (eventId: number, tickets_: number, force: boolean) => {
    api
      .updateEventTickets(eventId, tickets_, force)
      .then((response) => {
        if (response.result) {
          eventTicketsDialogRef.current?.close();
          Message.show('Ticket data have been updated.');
        }
        return 1;
      })
      .catch(console.error);
  };

  const handleEventCreate = (date: Date) => {
    eventMenuRef.current?.getInstance().close();
    eventAddDialogRef.current?.openWith(date);
  };

  const handleCreate = async (formData: any, valid: boolean) => {
    if (!valid) {
      Message.show('Please check the form data.', 'error');
      return;
    }

    try {
      const { id } = await api.createEvent(formData);
      Message.show(`Event has been created [${id}].`);
      eventAddDialogRef.current?.suggestNext(pre);
      handleRefresh();
    } catch (e) {}
  };

  const handleRefresh = () => {
    refreshEventsData(state.dateRangeStart, state.dateRangeEnd);
    onRefresh();
  };

  const handleCalendarViewChange = (dates: {
    start: moment.Moment;
    end: moment.Moment;
  }) => {
    console.log('calendar');
    const start = dates.start.format('YYYY-MM-DD');
    const end = dates.end.format('YYYY-MM-DD');
    refreshEventsData(start, end);
  };

  const { events, locale, refs, gates, isLoaded } = state;
  const hasData = isLoaded;

  const l18n = hasData ? new L18n(locale, refs) : null;
  const et = hasData
    ? EventType({
        categories: refs.type_categories,
        translation: locale,
      })
    : null;

  console.log(hasData, 'render');

  return hasData ? (
    <>
      <EventTicketBuyDialog
        ref={eventTicketsDialogRef}
        l18n={l18n}
        et={et}
        onTicketUpdate={handleTickets}
      />
      <EventAddDialog
        ref={eventAddDialogRef}
        callback={handleCreate}
        refs={refs}
        locale={locale}
        gates={gates}
      />
      <EventMenu
        ref={eventMenuRef}
        onEventTickets={handleEventTickets}
        onEventCreate={handleEventCreate}
      />
      <Calendar
        events={events}
        l18n={l18n}
        et={et}
        onMenu={handleMenu}
        onViewChange={handleCalendarViewChange}
      />
      <p />
    </>
  ) : (
    'Loading...'
  );
}
