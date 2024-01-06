import { useEffect, useState } from 'react';

import { DateRange } from '@blueprintjs/datetime2';

import { Api } from 'cosmoport-core-api-client';
import Table from '../components/table/Table';
import Message from '../components/messages/Message';
import _date from '../components/date/_date';

import {
  EventType,
  EventFormDataType,
  GateType,
  LocaleType,
  RefsType,
} from '../types/Types';

type Props = {
  api: Api;
  auth?: boolean;
  onRefresh?: () => void;
  pre: number;
};

type State = {
  events: EventType[];
  gates: GateType[];
  locale: LocaleType;
  defaultRange: DateRange;
  range: DateRange;
  refs: RefsType;
};

export default function TableContainer({
  api,
  auth = false,
  onRefresh = () => {},
  pre,
}: Props) {
  const [state, setState] = useState<State>({
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
    defaultRange: _date.getThreeDaysRange(),
    range: _date.getThreeDaysRange(),
  });

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    Promise.all([
      api.fetchReferenceData(),
      api.fetchTranslations(),
      apiGetEventInRange(state.range),
      api.fetchGates(),
    ])
      .then((data) =>
        setState({
          ...state,
          refs: data[0],
          locale: data[1].en,
          events: data[2],
          gates: data[3],
        }),
      )
      .catch(console.error);
  };

  const handleCreate = (
    formData: EventFormDataType,
    suggester: (time: number) => void,
  ) => {
    api
      .createEvent(formData)
      .then((result) => Message.show(`Event has been created [${result.id}].`))
      .then(() => suggester && suggester(pre))
      .then(() => handleRefresh())
      .catch(console.error);
  };

  const handleEdit = (formData: EventFormDataType) => {
    api
      .updateEvent(formData)
      .then((result) => {
        Message.show(`Event has been updated [${result.id}].`);
        handleRefresh();
      })
      .catch(console.error);
  };

  const handleDelete = (id: number) => {
    api
      .deleteEvent(id)
      .then((result) => {
        Message.show(`Deleted ${result.deleted}.`);
        handleRefresh();
      })
      .catch(console.error);
  };

  const handleRefresh = () => {
    getData();
    onRefresh();
  };

  const handleDateChange = (range_: DateRange) => {
    apiGetEventInRange(range_)
      .then((data) => setState({ ...state, events: data, range: range_ }))
      .catch(console.error);
  };

  const handleDateClear = () => {
    handleDateChange(state.defaultRange);
  };

  const apiGetEventInRange = (range: DateRange) =>
    api.get(
      `/timetable?date=${range[0] ? _date.toYmd(range[0]) : ''}&date2=${
        range[1] ? _date.toYmd(range[1]) : ''
      }`,
    );

  const { events, gates, locale, range, refs } = state;

  return (
    <Table
      auth={auth}
      events={events}
      gates={gates}
      locale={locale}
      onCreate={handleCreate}
      onDateRangeChange={handleDateChange}
      onDateRangeClear={handleDateClear}
      onDelete={handleDelete}
      onEdit={handleEdit}
      onRefresh={handleRefresh}
      range={range}
      refs={refs}
    />
  );
}
