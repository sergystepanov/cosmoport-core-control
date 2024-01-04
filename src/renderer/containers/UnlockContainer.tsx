import { ChangeEvent } from 'react';

import { NonIdealState } from '@blueprintjs/core';

type Props = {
  onAuth: (pass: string) => void;
};

export default function UnlockContainer({ onAuth = () => {} }: Props) {
  const handleUnlock = (event: ChangeEvent<HTMLInputElement>) =>
    onAuth(event.target.value);

  return (
    <NonIdealState icon="lock" title="Here you can enter the password.">
      <input type="password" onChange={handleUnlock} />
    </NonIdealState>
  );
}
