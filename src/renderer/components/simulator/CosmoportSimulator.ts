import Simulator, { Action, MaxTick, SimulatorClock } from './Simulator';
import { eventStatus } from 'cosmoport-core-api-client';

import { EventType } from '../../types/Types';
import _date from '../date/_date';

export type CosmoActionType =
  | 'archive'
  | 'play_sound'
  | 'set_status'
  | 'show_return'
  | 'turn_on_gate';

export interface CosmoAction extends Action<CosmoActionType> {
  /** Event reference. */
  event: EventType;
  /** The trigger time of the action in seconds since midnight. */
  time: number;
}

interface Props {
  archive?: number;
  boarding?: number;
  clock: SimulatorClock;
  onAction?: (_: CosmoAction) => void;
  onTick?: (_: number, __?: boolean) => void;
}

// time scale
const sec = 60;

export default function CosmoportSimulator({
  archive = 10,
  boarding = 5,
  clock,
  onAction = (_: CosmoAction) => {},
  onTick = (_: number, __?: boolean) => {},
}: Props) {
  const simulator = Simulator<CosmoAction>({ clock });

  let events: EventType[] = []; // oof

  simulator.queue = [];
  simulator.onTick = (actions, t, s) => {
    actions.length > 0 && actions.forEach((a) => onAction(a));

    const unix = Math.trunc(clock.timestamp / 1000);
    if (!(t === 0 || unix % sec === 0)) return;

    const secSinceMidnight = _date.toSeconds(new Date(clock.timestamp));
    onTick(secSinceMidnight / sec, s);
  };

  const schedule = (events: EventType[]) =>
    events
      // Not a canceled event
      .filter((event) => event.eventStatusId !== eventStatus.CANCELED)
      // Generate actions from the events
      .map((event): CosmoAction[] => {
        const boardingTime =
          event.startTime - boarding > 0 ? event.startTime - boarding : 0;
        const eventTime = event.startTime;
        const timeOfReturn = event.startTime + event.durationTime;
        const beforeReturnTime =
          timeOfReturn - boarding > 0 ? timeOfReturn - boarding : 0;
        const archiveTime = eventTime + archive;

        return [
          // set the event status to boarding
          {
            event: { ...event, eventStatusId: 2 },
            time: boardingTime * sec,
            data: 'boarding',
            do: 'set_status',
          },
          // Gate? show the number
          // Play sound
          {
            event,
            time: boardingTime * sec,
            do: 'play_sound',
            data: 'boarding',
          },
          // Turn on the gate display
          { event, time: boardingTime * sec, do: 'turn_on_gate' },
          // Set event status to departed
          {
            event: { ...event, eventStatusId: 3 },
            time: eventTime * sec,
            data: 'departed',
            do: 'set_status',
          },
          // Play sound
          { event, time: eventTime * sec, do: 'play_sound', data: 'departure' },
          // Archive the event
          { event, time: archiveTime * sec, do: 'archive' },
          {
            event: { ...event, eventStatusId: 4 },
            time: beforeReturnTime * sec,
            do: 'show_return',
          },
          {
            event: { ...event, eventStatusId: 5 },
            time: timeOfReturn * sec,
            data: 'returned',
            do: 'set_status',
          },
        ];
      })
      // flatten all actions into one dimensional array
      .reduce((acc, cur) => acc.concat(cur), []);

  return {
    get actions() {
      // we assume that the internal representation is sorted
      return Object.values(simulator.queue).flat(); // oof
    },
    get ticks() {
      return simulator.time / sec;
    },
    set archive(m: number) {
      archive = m;
      simulator.queue = schedule(events);
    },
    set boarding(m: number) {
      boarding = m;
      simulator.queue = schedule(events);
    },
    set events(e: EventType[]) {
      events = e;
      simulator.queue = schedule(e);
    },
    set onOverlap(cb: () => void) {
      simulator.onOverlap = cb;
    },
    set business(hours: [number, number] | null) {
      simulator.shift =
        hours === null
          ? null
          : hours[0] + hours[1] === 0
          ? [0, MaxTick]
          : [hours[0] * sec, hours[1] * sec];
    },

    reset: (t: number = 0) => simulator.reset(t * sec),
    start: () => simulator.start(),
    stop: () => simulator.stop(),
  };
}
