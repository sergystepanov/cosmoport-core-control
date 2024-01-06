import { NonIdealState } from '@blueprintjs/core';

export default function LockContainer({
  onDeAuth = () => {},
}: {
  onDeAuth: () => void;
}) {
  return (
    <>
      <br />
      <NonIdealState
        title={'Here you can go back to normal user mode.'}
        children={<button onClick={onDeAuth}>Logout</button>}
      />
    </>
  );
}
