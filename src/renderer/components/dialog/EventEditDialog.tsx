import { useRef } from 'react';

import { Dialog, DialogBody, DialogFooter, Button } from '@blueprintjs/core';

import EventForm from '../form/EventForm';
import EventMapper from '../../components/mapper/EventMapper';
import { EventType, GateType, LocaleType, RefsType } from '../../types/Types';

type Props = {
  callback: (data: any, isValid: boolean) => void;
  event?: EventType;
  gates?: GateType[];
  isOpen?: boolean;
  locale: LocaleType;
  refs: RefsType;
  onClose?: () => void;
};

export default function EventEditDialog({
  callback,
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
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      canOutsideClickClose={false}
      title="Edit event"
    >
      <DialogBody>
        <EventForm
          event={event}
          ref={form}
          locale={locale}
          refs={refs}
          gates={gates}
        />
      </DialogBody>
      <DialogFooter actions={<Button onClick={passState} text="Update" />} />
    </Dialog>
  );
}
