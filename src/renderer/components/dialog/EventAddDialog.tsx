import { useRef } from 'react';

import { Button } from '@blueprintjs/core';

import EventForm from '../form/EventForm';
import EventMapper from '../../components/mapper/EventMapper';
import { GateType, LocaleType, RefsType } from '../../types/Types';
import { BaseDialog, BaseDialogCallback, BaseDialogProps } from './BaseDialog';

type Props = {
  date?: string;
  gates?: GateType[];
  locale: LocaleType;
  next: number;
  refs: RefsType;
} & BaseDialogProps &
  BaseDialogCallback<(data: any, isValid: boolean) => void>;

export default function EventAddDialog({
  isOpen,
  onClose,
  date = '',
  callback = () => {},
  refs,
  locale,
  gates = [],
  next = 0,
}: Props) {
  const form: any = useRef();

  const handleAddClick = () => {
    const data = form.current?.getFormData();
    callback(EventMapper.fromForm(data), data.valid);
    // set time for the next event even if its addition failed on the server
    data.valid && next > 0 && form.current?.suggestNext(next);
  };

  return (
    <BaseDialog
      isOpen={isOpen}
      onClose={onClose}
      title="New event"
      actions={<Button onClick={handleAddClick} text="Create" />}
    >
      <EventForm
        ref={form}
        locale={locale}
        refs={refs}
        gates={gates}
        date={date}
        forCreate
      />
    </BaseDialog>
  );
}
