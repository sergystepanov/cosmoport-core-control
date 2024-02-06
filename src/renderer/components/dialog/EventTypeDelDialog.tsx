import React from 'react';

import { Button, Callout, Colors } from '@blueprintjs/core';
import { Remove } from '@blueprintjs/icons';

import EventType from '../eventType/EventType';
import { EventTypeType } from '../../types/Types';
import { BaseDialog, BaseDialogCallback, BaseDialogProps } from './BaseDialog';

type Props = {
  et: ReturnType<typeof EventType>;
  types?: EventTypeType[];
  onSuccess?: () => void;
} & BaseDialogProps &
  BaseDialogCallback<(id: string, onSuccess: () => void) => void>;

export default function EventTypeDelDialog({
  et,
  types = [],
  callback = () => {},
  state,
  onClose = () => {},
  onSuccess = () => {},
}: Props) {
  const onDelete = (event: React.MouseEvent<HTMLElement>) => {
    const { id } = event.currentTarget.dataset;
    id && callback(id, onSuccess);
  };

  if (!types) {
    return null;
  }

  const eventTypes = types.map((op) => {
    const categories = et.getCategories(op);
    const name = et.getName(op);
    const description = et.getDescription(op);

    return (
      <div key={op.id}>
        <span title={description}>
          {categories.join(' / ')}&nbsp;/&nbsp;{name}
        </span>
        <Button minimal icon="remove" data-id={op.id} onClick={onDelete} />
      </div>
    );
  });

  return (
    <BaseDialog state={state} onClose={onClose} title="Delete an event type">
      <Callout>
        Click on the <Remove /> button if you want to delete an event type.
        <div style={{ color: Colors.RED1 }}>
          The application does not allow to delete event types which are used in
          existing events.
        </div>
      </Callout>
      <p>&nbsp;</p>
      {eventTypes}
    </BaseDialog>
  );
}
