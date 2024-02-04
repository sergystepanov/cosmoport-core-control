import { useRef } from 'react';

import { Button } from '@blueprintjs/core';

import EventForm from '../form/EventForm';
import EventMapper from '../../components/mapper/EventMapper';
import { EventType, GateType, LocaleType, RefsType } from '../../types/Types';
import { BaseDialog, BaseDialogCallback, BaseDialogProps } from './BaseDialog';

type Props = {
  event?: EventType;
  gates?: GateType[];
  locale: LocaleType;
  refs: RefsType;
} & BaseDialogProps &
  BaseDialogCallback<(data: any, isValid: boolean) => void>;

export default function EventEditDialog({
  callback = () => {},
  event,
  gates = [],
  isOpen = false,
  locale,
  refs,
  onClose = () => {},
}: Props) {
  const form: any = useRef();

  const passState = () => {
    const data = form.current.getFormData();
    callback(EventMapper.fromForm(data), data.valid);
  };

  if (!event) return;

  return (
    <BaseDialog
      isOpen={isOpen}
      onClose={onClose}
      title="Edit event"
      actions={<Button onClick={passState} text="Update" />}
    >
      <EventForm
        event={event}
        ref={form}
        locale={locale}
        refs={refs}
        gates={gates}
      />
    </BaseDialog>
  );
}
