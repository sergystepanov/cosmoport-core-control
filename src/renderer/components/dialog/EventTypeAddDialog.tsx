import { useRef } from 'react';

import {
  Dialog,
  DialogBody,
  DialogFooter,
  Button,
  Intent,
} from '@blueprintjs/core';

import EventTypeForm from '../form/event/EventTypeForm';
import { EventTypeCategoryType } from '../../types/Types';
import EventType from '../eventType/EventType';

type Props = {
  et: ReturnType<typeof EventType>;
  callback: (data: any, callback: () => void) => void;
  categoryCreateCallback: (name: string) => void;
  categories?: EventTypeCategoryType[];
  isOpen?: boolean;
  toggle: () => void;
};

export default function EventTypeAddDialog({
  callback,
  categoryCreateCallback,
  et,
  categories = [],
  isOpen = false,
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
    <Dialog
      isOpen={isOpen}
      onClose={toggle}
      canOutsideClickClose={false}
      title="Create new event type"
    >
      <DialogBody>
        <EventTypeForm
          categories={cats}
          ref={ref}
          categoryCreateCallback={handleNewCategory}
        />
      </DialogBody>
      <DialogFooter
        minimal
        actions={
          <Button intent={Intent.PRIMARY} onClick={passState} text="Create" />
        }
      />
    </Dialog>
  );
}
