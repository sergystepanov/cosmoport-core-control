import { Alert, Intent } from '@blueprintjs/core';

type Props = {
  id: number;
  isOpen?: boolean;
  onCancel?: () => void;
  onConfirm?: (id: number) => void;
};

export default function EventDeleteAlert({
  id,
  isOpen = false,
  onConfirm = () => {},
  onCancel = () => {},
}: Props) {
  const handleConfirm = () => {
    onConfirm(id);
  };

  return (
    <Alert
      intent={Intent.PRIMARY}
      isOpen={isOpen}
      confirmButtonText="Delete"
      cancelButtonText="Cancel"
      onConfirm={handleConfirm}
      onCancel={onCancel}
    >
      <p>
        Are you sure you want to delete selected <b>event</b>? You will not be
        able to restore it.
      </p>
    </Alert>
  );
}
