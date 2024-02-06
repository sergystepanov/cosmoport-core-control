import { useState } from 'react';

import { Button, Intent } from '@blueprintjs/core';

import LocaleForm from '../form/locale/LocaleForm';
import { BaseDialog, BaseDialogCallback, BaseDialogProps } from './BaseDialog';

type Props = BaseDialogProps & BaseDialogCallback<(v: any) => void>;

export default function LocaleAddDialog({
  callback = () => {},
  state,
  onClose = () => {},
}: Props) {
  const [locale, setLocale] = useState({ code: '', description: '' });

  const handleChange = (code: string | null, description: string | null) => {
    setLocale({
      ...locale,
      ...(code && { code }),
      ...(description && { description }),
    });
  };

  const passState = () => {
    const { code, description } = locale;
    callback({ code, description });
  };

  const { code, description } = locale;

  return (
    <BaseDialog
      state={state}
      onClose={onClose}
      title="Create locale"
      actions={
        <Button intent={Intent.PRIMARY} onClick={passState} text="Create" />
      }
    >
      <LocaleForm
        code={code}
        description={description}
        onChange={handleChange}
      />
    </BaseDialog>
  );
}
