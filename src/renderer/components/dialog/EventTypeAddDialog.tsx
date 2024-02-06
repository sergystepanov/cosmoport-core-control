import { useRef } from 'react';

import { Button, Intent } from '@blueprintjs/core';

import EventTypeForm from '../form/event/EventTypeForm';
import { EventTypeCategoryType } from '../../types/Types';
import EventType from '../eventType/EventType';
import { BaseDialog, BaseDialogCallback, BaseDialogProps } from './BaseDialog';

type Props = {
  et: ReturnType<typeof EventType>;
  categoryCreateCallback: (name: string) => void;
  categories?: EventTypeCategoryType[];
  toggle: () => void;
} & BaseDialogProps &
  BaseDialogCallback<(data: any, callback: () => void) => void>;

export default function EventTypeAddDialog({
  callback = () => {},
  categoryCreateCallback,
  et,
  categories = [],
  state,
  toggle = () => {},
}: Props) {
  const ref: any = useRef();

  const passState = () => {
    const form = ref.current;
    form && callback(form.getFormData(), toggle);
  };

  const handleNewCategory = (name: string) => {
    categoryCreateCallback(name);
  };

  // build root cats
  const cats = categories
    .filter((c) => c.parent === 0)
    .map((c) => ({ id: c.id, name: et.getCategory(c) }));

  return (
    <BaseDialog
      state={state}
      onClose={toggle}
      title="Create new event type"
      actions={
        <Button intent={Intent.PRIMARY} onClick={passState} text="Create" />
      }
    >
      <EventTypeForm
        categories={cats}
        ref={ref}
        categoryCreateCallback={handleNewCategory}
      />
    </BaseDialog>
  );
}
