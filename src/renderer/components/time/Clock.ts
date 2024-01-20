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
   * Be aware that it is incremented by the fixed value of 1000ms each clock tick.
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
  let clockRate = rate;
  let done: any = () => {};
  const sub = PubSub<number>();
  const wait = new Promise((resolve) => (done = resolve));

  let ticker = !manual
    ? setInterval(() => {
        sub.pub('tick', t++);
        timestamp += 1000;
      }, clockRate)
    : 0;

  return {
    get rate() {
      return clockRate;
    },
    set rate(rate: number) {
      clockRate = rate;
      clearInterval(ticker);
      ticker = setInterval(() => {
        sub.pub('tick', t++);
        timestamp += 1000;
      }, clockRate);
    },
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
