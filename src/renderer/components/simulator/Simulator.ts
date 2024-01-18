export interface SimOptionsType {
  /**
   * An internal clock implementation.
   */
  clock: SimulatorClock;

  /**
   * Specifies a tick rate of the simulation in milliseconds,
   * i.e. how fast the internal seconds will pass.
   *
   * @default 1000 ms
   */
  rate?: number;

  /**
   * Scale up external event start times with a factor.
   *
   * Needed when you have to simulate events
   * not in the seconds resolution, for example,
   * events that are triggered in minutes this factor should be 60.
   *
   * @note !to replace it with a proper external transform function.
   *
   * @default 1
   */
  timeScale?: number;

  /**
   * Specifies start and end seconds of the day
   * when the simulation will run.
   *
   * @default no limit or [0, 86400-1]
   */
  shift?: [number, number] | null;

  /**
   * A second from the day range to start the simulation from.
   *
   * @default 0
   */
  startTime?: number;
}

export interface Action<D> {
  /** Data associated with the triggered action. */
  data?: any;

  /**
   * Arbitrary time of the action trigger.
   * Usually it is the number of seconds since the midnight.
   **/
  time: number;

  /** The type of the action. Usually a string.*/
  do: D;
}

export interface SimulatorClock {
  onTick(cb: (t?: number) => void): { unsub: () => void };

  timestamp: number;
}

// 1 day = 86400 sec - 1 (from 0 to 86399)
export const MaxTick = 86400 - 1;

/**
 * Event simulator.
 *
 * Simulates 24 hours of events with up to 1 second resolution.
 *
 * */
export default function Simulator<A extends Action<string>>({
  clock,
  startTime = 0,
  shift = [0, MaxTick],
}: SimOptionsType) {
  // dictionary: {tick time (a second of the day): [event1, event2 if same tick]}
  let queue: { [index: number]: A[] } = [];

  // callbacks
  let onOverlap = () => {};
  let onTick: (a: A[], t: number, s?: boolean) => void = () => {};

  // a foolproof switch to prevent duplicate tickers
  let isStarted = false;

  // debatable
  let t = startTime > MaxTick ? MaxTick : startTime;

  // null-object for the ticker
  let ticker = {
    unsub: () => {},
  };

  return {
    /** Sets the callback before the tick overlaps 24h (86399s) border. */
    set onOverlap(cb: () => void) {
      onOverlap = cb;
    },

    /**
     * Sets the simulator tick callback.
     *
     * @param cb - A callback function.
     * @param cb.a - An ordered list of actions for the current tick.
     * @param cb.t - The current tick value starting from startValue,
     *               so, if the startValue is 0, the first tick will also be 0.
     * @param cb.s - Whether the tick is in the shift (work) hours.
     */
    set onTick(cb: (a: A[], t: number, s?: boolean) => void) {
      onTick = cb;
    },

    get queue(): { [index: number]: A[] } {
      return queue;
    },

    /** Creates the event queue sorted by time. */
    set queue(actions: A[]) {
      const newQ: { [index: number]: A[] } = {};
      // for loop is faster
      const len = actions.length;
      for (let i = 0; i < len; i++) {
        const a = actions[i];
        // skip events with unknown time
        a.time !== undefined && (newQ[a.time] ||= []).push(a);
      }
      queue = newQ;
    },

    /** Resets the internal ticker to 0 or provided value. */
    reset: (start = 0) => {
      t = start;
    },

    /** Sets a new shift range. */
    set shift(range: [number, number] | null) {
      shift = range;
    },

    /** Starts the thicker. */
    start: () => {
      if (isStarted) return;
      isStarted = true;

      // the simulation order is:
      // 1. tick_handler (with the current tick as a param)
      // 2. overlap_handler (with the current tick accessible in the clock)
      // 3. tick++ (next tick)
      ticker = clock.onTick(() => {
        onTick(
          queue[t] ?? [],
          t,
          shift !== null && shift[0] <= t == t <= shift[1],
        );
        t >= MaxTick && onOverlap();
        t++;
      });
    },

    /** Stops the ticker. */
    stop: () => {
      ticker.unsub();
      isStarted = false;
    },

    /** Returns the current number of the simulation ticks. */
    get time() {
      return t;
    },
  };
}
