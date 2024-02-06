import React from 'react';

import { Dialog, DialogBody, DialogFooter } from '@blueprintjs/core';

export interface BaseDialogProps {
  // optional dialog button panel at the bottom
  actions?: React.ReactNode;
  // main content of the dialog window
  children?: React.ReactNode;
  // the main property for displaying or hiding the dialog
  state?: DialogState;
  // an optional callback after closing the dialog
  onClose?: () => void;
  // dialog title
  title?: string;
}

export interface BaseDialogCallback<fn> {
  callback?: fn;
}

export enum DialogState {
  CLOSE,
  ADD,
  EDIT,
  DELETE,
}

export function BaseDialog({
  actions = null,
  children = null,
  state = DialogState.CLOSE,
  onClose = () => {},
  title = '',
}: BaseDialogProps) {
  const isOpen =
    state !== undefined &&
    (state === DialogState.ADD ||
      state === DialogState.EDIT ||
      state === DialogState.DELETE);

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      canOutsideClickClose={false}
      title={title}
    >
      <DialogBody>{children}</DialogBody>
      <DialogFooter minimal actions={actions} />
    </Dialog>
  );
}
