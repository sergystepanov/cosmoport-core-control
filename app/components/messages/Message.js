import { Position, Toaster, Intent } from '@blueprintjs/core';

const toaster = Toaster.create({ className: 'my-toaster', position: Position.BOTTOM_RIGHT });

export default class Message {
  static show(text, type) {
    toaster.show({ message: text, intent: (type === 'error' ? Intent.DANGER : Intent.SUCCESS) });
  }
}
