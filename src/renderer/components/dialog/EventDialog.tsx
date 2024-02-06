import { useRef } from 'react';

import { Button } from '@blueprintjs/core';

import {
  BaseDialog,
  BaseDialogCallback,
  BaseDialogProps,
  DialogState,
} from './BaseDialog';
import EventForm from '../form/EventForm';
import EventMapper from '../../components/mapper/EventMapper';

import { EventType, GateType, LocaleType, RefsType } from '../../types/Types';

type Props = {
  date?: string;
  event?: EventType;
  gates?: GateType[];
  locale: LocaleType;
  next: number;
  refs: RefsType;
} & BaseDialogProps &
  BaseDialogCallback<(data: any, isValid: boolean) => void>;

export { DialogState } from './BaseDialog';

export default function EventDialog({
  state,
  onClose,
  date = '',
  event,
  callback = () => {},
  refs,
  locale,
  gates = [],
  next = 0,
}: Props) {
  // when there was no event selected on edit
  if (state === DialogState.EDIT && event === undefined) {
    return null;
  }

  const form: any = useRef();

  const handleClick = () => {
    const data = form.current?.getFormData();
    callback(EventMapper.fromForm(data), data.valid);

    if (state === DialogState.ADD) {
      // set time for the next event even if its addition failed on the server
      data.valid && next > 0 && form.current?.suggestNext(next);
    }
  };

  return (
    <BaseDialog
      state={state}
      onClose={onClose}
      title={state === DialogState.ADD ? 'New event' : 'Edit event'}
      actions={
        <Button
          onClick={handleClick}
          text={state === DialogState.ADD ? 'Add' : 'Save'}
        />
      }
    >
      <EventForm
        event={event}
        ref={form}
        locale={locale}
        refs={refs}
        gates={gates}
        date={date}
        forCreate={state === DialogState.ADD}
      />
    </BaseDialog>
  );
}
