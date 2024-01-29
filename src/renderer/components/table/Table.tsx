import React, { useRef, useState, MutableRefObject as Ref } from 'react';

import { Button } from '@blueprintjs/core';
import { DateRange, DateRangeInput3 } from '@blueprintjs/datetime2';

import EventAddDialog from '../dialog/EventAddDialog';
import EventEditDialog from '../dialog/EventEditDialog';
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
  const addDialogRef: Ref<null | EventAddDialog> = useRef(null);
  const deleteAlertRef: Ref<null | EventDeleteAlert> = useRef(null);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [event, setEvent] = useState<EventType>();

  const suggestNext = (pre: number) => addDialogRef.current?.suggestNext(pre);

  const handleAddClick = () => addDialogRef.current?.toggleDialog();
  const handleCreate = (data: EventFormDataType, ok: boolean) => {
    ok ? onCreate(data, suggestNext) : showFormError();
  };
  const handleEdit = (event: EventType) => {
    setEvent(event);
    setIsEditDialogOpen(true);
  };
  const handleEditApply = (data: EventType, ok: boolean) => {
    ok ? onEdit(data) : showFormError();
  };
  const handleEditClose = () => {
    setIsEditDialogOpen(false);
    setEvent(undefined);
  };
  const handlePreDelete = (id: number) => deleteAlertRef.current?.open(id);

  return (
    <>
      <EventDeleteAlert ref={deleteAlertRef} onConfirm={onDelete} />
      <EventAddDialog
        ref={addDialogRef}
        callback={handleCreate}
        refs={refs}
        locale={locale}
        gates={gates}
      />
      <EventEditDialog
        event={event}
        callback={handleEditApply}
        refs={refs}
        isOpen={isEditDialogOpen}
        locale={locale}
        gates={gates}
        onClose={handleEditClose}
      />
      <div className={styles.controls}>
        <Button minimal icon="add" onClick={handleAddClick} />
        <Button minimal icon="refresh" onClick={onRefresh} />
        <DateRangeInput3 value={range} onChange={onDateRangeChange} />
        <Button minimal icon="remove" onClick={onDateRangeClear} />
      </div>
      <EventTable
        editCallback={handleEdit}
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
