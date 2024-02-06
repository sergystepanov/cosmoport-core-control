import React, { useState } from 'react';

import { Button } from '@blueprintjs/core';
import { DateRange, DateRangeInput3 } from '@blueprintjs/datetime2';

import EventDialog, { DialogState } from '../dialog/EventDialog';
import EventDeleteAlert from '../dialog/EventDeleteAlert';
import EventTable from '../eventTable/EventTable';
import {
  EventType,
  EventFormDataType,
  GateType,
  LocaleType,
  RefsType,
} from '../../types/Types';
import Message from '../messages/Message';

import styles from './Table.module.css';

type Props = {
  auth?: boolean;
  events?: EventType[];
  gates?: GateType[];
  locale: LocaleType;
  onCreate?: (data: EventFormDataType, suggest: (time: number) => void) => void;
  onDateRangeChange?: (range: DateRange) => void;
  onDateRangeClear?: () => void;
  onDelete?: (id: number) => void;
  onEdit?: (event: EventType) => void;
  onRefresh?: () => void;
  range: DateRange;
  refs: RefsType;
};

export default function Table({
  auth = false,
  events = [],
  gates = [],
  locale,
  onCreate = () => {},
  onDateRangeChange = () => {},
  onDateRangeClear = () => {},
  onDelete = () => {},
  onEdit = () => {},
  onRefresh = () => {},
  range,
  refs,
}: Props) {
  const [dialogState, setDialogState] = useState(DialogState.CLOSE);
  const [nextRange, setNextRange] = useState(0);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [eventId, setEventId] = useState(0);
  const [event, setEvent] = useState<EventType>();

  const suggestNext = (pre: number) => setNextRange(pre);

  const handleAddClick = () => setDialogState(DialogState.ADD);
  const handleEditClick = (event: EventType) => {
    setEvent(event);
    setDialogState(DialogState.EDIT);
  };
  const handleEventDialog = (data: EventType, ok: boolean) => {
    if (!ok) {
      showFormError();
      return;
    }
    dialogState === DialogState.ADD && onCreate(data, suggestNext);
    dialogState === DialogState.EDIT && onEdit(data);
  };
  const handleEventDialogClose = () => {
    setDialogState(DialogState.CLOSE);
    setEvent(undefined);
  };
  const handlePreDelete = (id: number) => setEventId(id);
  const handleDeleteClose = () => setIsDeleteDialogOpen(false);

  return (
    <>
      <EventDeleteAlert
        id={eventId}
        isOpen={isDeleteDialogOpen}
        onConfirm={onDelete}
        onCancel={handleDeleteClose}
      />
      <EventDialog
        state={dialogState}
        event={event}
        callback={handleEventDialog}
        refs={refs}
        locale={locale}
        gates={gates}
        next={nextRange}
        onClose={handleEventDialogClose}
      />
      <div className={styles.controls}>
        <Button minimal icon="add" onClick={handleAddClick} />
        <Button minimal icon="refresh" onClick={onRefresh} />
        <DateRangeInput3 value={range} onChange={onDateRangeChange} />
        <Button minimal icon="remove" onClick={onDateRangeClear} />
      </div>
      <EventTable
        editCallback={handleEditClick}
        callback={handlePreDelete}
        refs={refs}
        locale={locale}
        events={events}
        auth={auth}
      />
    </>
  );
}

function showFormError() {
  return Message.show('Please check the form data.', 'error');
}
