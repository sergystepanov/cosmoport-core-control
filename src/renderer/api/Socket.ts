import { Websocket as ApiSocket } from 'cosmoport-core-api-client';

export class Websocket extends ApiSocket {
  private _onMessage = (data: any) => {};

  get onMessage(): (data: any) => void {
    return this._onMessage;
  }

  set onMessage(value: (data: any) => void) {
    this._onMessage = value;
  }
}

const ws = ({ ws, ssl = '' }: { ws: string; ssl?: string }): Websocket => {
  const socket = new Websocket({
    url: `ws${ssl === 'true' ? 's' : ''}://${ws}`,

    onopen() {},

    onmessage(...args: { data: any }[]) {
      const message = args[0].data;
      socket.onMessage(message);
    },

    onclose() {
      socket && socket.close();
    },

    onerror(...args: any[]) {
      console.error(args);
    },
  });

  return socket;
};

export default ws;
