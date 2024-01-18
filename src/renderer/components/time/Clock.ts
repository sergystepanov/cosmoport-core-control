import PubSub from './PubSub';

export interface ClockOpts {
  /**
   * Disables auto ticker and switches to the manual
   * time advance with the tick() method.
   */
  manual?: boolean;

  /**
   * Specifies the tick rate of the clock in milliseconds.
   * Or how much time one second tick will take.
   *
   * @default 1000 ms
   */
  rate?: number;

  /**
   * Contains current UTC timestamp in milliseconds
   * that will be incremented with each clock tick.
   *
   * @default local Date as UTC+0
   */
  timestamp?: number;
}

export function Clock({
  rate = 1000,
  timestamp = +new Date(),
  manual = false,
}: ClockOpts) {
  let t = 0;
  let done: any = () => {};
  const sub = PubSub<number>();
  const wait = new Promise((resolve) => (done = resolve));

  const ticker = !manual
    ? setInterval(() => {
        sub.pub('tick', t++);
        timestamp += 1000;
      }, rate)
    : 0;

  return {
    get timestamp() {
      return timestamp;
    },
    set timestamp(n: number) {
      timestamp = n;
    },
    onTick: (cb: (t?: number) => void) => sub.sub('tick', (n) => cb(n)),
    done: wait,
    stop: () => {
      clearInterval(ticker);
      done();
    },
    tick: () => sub.pub('tick', ++t),
  };
}
