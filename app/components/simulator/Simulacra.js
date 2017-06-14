import Action from './action/Action';

const EventMap = (event, time) => {
  const boardingTime = event.startTime - time > 0 ? event.startTime - time : 0;
  const eventTime = event.startTime;
  const returningTime = event.startTime + event.durationTime;
  const beforeReturnTime = returningTime - time > 0 ? returningTime - time : 0;
  const archiveTime = eventTime + 10;

  return [
    // set event status to boarding
    new Action(event, boardingTime, 'set_status_boarding', 1),
    // Gate? show the number
    // Play sound
    new Action(event, boardingTime, 'play_boarding_sound', 2),
    // Show gate
    new Action(event, boardingTime, 'turn_on_gate', 3),
    // set event status to departed
    new Action(event, eventTime, 'set_status_departed', 4),
    // Play sound
    new Action(event, eventTime, 'play_departed_sound', 5),
    // archive event
    new Action(event, archiveTime, 'archive', 6),
    new Action(event, beforeReturnTime, 'show_return', 7),
    new Action(event, returningTime, 'set_status_returned', 8)
  ];
};

export default class Simulacra {
  actions = (events) => events
    // Not a canceled event
    .filter(event => event.eventStatusId !== 1)
    .map(event => EventMap(event, 10))
    .reduce((acc, cur) => acc.concat(cur), [])
    .sort((a, b) => a.time - b.time || a.weight - b.weight);
}
