import React from 'react';

import { Dialog, DialogBody, DialogFooter } from '@blueprintjs/core';

export interface BaseDialogProps {
  // optional dialog button panel at the bottom
  actions?: React.ReactNode;
  // main content of the dialog window
  children?: React.ReactNode;
  // the main property for displaying or hiding the dialog
  isOpen?: boolean;
  // an optional callback after closing the dialog
  onClose?: () => void;
  // dialog title
  title?: string;
}

export interface BaseDialogCallback<fn> {
  callback?: fn;
}

export function BaseDialog({
  actions = null,
  children = null,
  isOpen = false,
  onClose = () => {},
  title = '',
}: BaseDialogProps) {
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
