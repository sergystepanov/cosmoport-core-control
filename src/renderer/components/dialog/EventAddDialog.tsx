import { useRef } from 'react';

import { Dialog, DialogBody, DialogFooter, Button } from '@blueprintjs/core';

import EventForm from '../form/EventForm';
import EventMapper from '../../components/mapper/EventMapper';
import { GateType, LocaleType, RefsType } from '../../types/Types';

type Props = {
  isOpen?: boolean;
  callback: (data: any, isValid: boolean) => void;
  refs: RefsType;
  locale: LocaleType;
  gates?: GateType[];
  onClose?: () => void;
  date?: string;
  next: number;
};

export default function EventAddDialog({
  isOpen = false,
  onClose = () => {},
  date = '',
  callback,
  refs,
  locale,
  gates = [],
  next = 0,
}: Props) {
  const form: any = useRef();

  const passState = () => {
    const data = form.current.getFormData();
    callback(EventMapper.fromForm(data), data.valid);
  };

  if (next > 0) {
    form.current.suggestNext(next);
  }

  return (
    <Dialog
      isOpen={isOpen}
      icon="barcode"
      onClose={onClose}
      canOutsideClickClose={false}
      title="New event"
    >
      <DialogBody useOverflowScrollContainer={false}>
        <EventForm
          ref={form}
          locale={locale}
          refs={refs}
          gates={gates}
          date={date}
          forCreate
        />
      </DialogBody>
      <DialogFooter
        actions={<Button onClick={passState} text="Create" />}
      ></DialogFooter>
    </Dialog>
  );
}
