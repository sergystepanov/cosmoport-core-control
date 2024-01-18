import React, { useReducer, useEffect } from 'react';

export interface ServerClock {
  timestamp: number;

  onTick(cb: (t?: number) => void): { unsub: () => void };
}

export default function ServerTime({ clock }: { clock: ServerClock }) {
  const [, forceUpdate] = useReducer((o) => !o, false);

  useEffect(() => {
    const x = clock.onTick(() => forceUpdate());
    return () => {
      x.unsub();
    };
  }, [clock]);

  const date = new Date(clock.timestamp);

  const hh = date.getHours(),
    mm = (date.getMinutes() + '').padStart(2, '0'),
    ss = (date.getSeconds() + '').padStart(2, '0');

  return <>{`${hh}:${mm}:${ss}`}</>;
}
