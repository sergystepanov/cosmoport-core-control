import CosmoportSimulator from './CosmoportSimulator';
import { Clock } from '../time/Clock';

describe('Test Cosmoport simulator', () => {
  it('should run', async () => {
    let tick = 0;
    let hadActions = false;
    const clock = Clock({ rate: 1, timestamp: 946760399000 });
    const cs = CosmoportSimulator({
      clock,
      onAction: () => (hadActions = true),
      onTick: () => {
        tick++;
        tick >= 5 && clock.stop();
      },
    });

    cs.events = [
      {
        id: 1,
        eventStatusId: 0,
        cost: 0,
        contestants: 0,
        eventDate: '2000-01-01',
        dateAdded: '2000-01-01',
        durationTime: 40,
        eventDestinationId: 0,
        eventStateId: 0,
        eventTypeId: 0,
        gate2Id: 1,
        gateId: 1,
        startTime: 0,
        peopleLimit: 0,
        repeatInterval: 0,
      },
    ];

    cs.start();

    await clock.done;

    expect(hadActions).toBeTruthy();
  });
});
