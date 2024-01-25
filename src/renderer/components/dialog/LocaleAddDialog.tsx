import { useState } from 'react';

import {
  Dialog,
  Button,
  Intent,
  DialogBody,
  DialogFooter,
} from '@blueprintjs/core';

import LocaleForm from '../form/locale/LocaleForm';

type Props = {
  callback?: (v: any) => void;
  isOpen?: boolean;
  onClose?: () => void;
};

export default function LocaleAddDialog({
  callback = () => {},
  isOpen = false,
  onClose = () => {},
}: Props) {
  const [state, setState] = useState({ code: '', description: '' });

  const handleChange = (code: string | null, description: string | null) => {
    setState({
      ...state,
      ...(code && { code }),
      ...(description && { description }),
    });
  };

  const passState = () => {
    const { code, description } = state;
    callback({ code, description });
  };

  const { code, description } = state;

  return (
    <Dialog
      icon="translate"
      isOpen={isOpen}
      onClose={onClose}
      canOutsideClickClose={false}
      title="Create locale"
    >
      <DialogBody>
        <LocaleForm
          code={code}
          description={description}
          onChange={handleChange}
        />
      </DialogBody>
      <DialogFooter
        actions={
          <Button intent={Intent.PRIMARY} onClick={passState} text="Create" />
        }
      />
    </Dialog>
  );
}
