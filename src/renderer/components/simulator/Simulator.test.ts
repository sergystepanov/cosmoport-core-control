import Simulator, { MaxTick, Action } from './Simulator';
import { Clock } from '../time/Clock';

describe('Simulator test', () => {
  let clock: ReturnType<typeof Clock>;

  beforeEach(() => (clock = Clock({ rate: 1 })));
  afterEach(() => clock.stop());

  it('should simulate at all', async () => {
    const sim = Simulator({ clock });

    let tick = 0;
    clock.onTick(() => tick++ >= 5 && clock.stop());

    sim.onTick = (_, t) => {
      // when the simulation is stopped
      // but the clock is still running
      t === 3 && sim.stop();
    };
    sim.start();
    await clock.done;

    expect(sim.time).toBe(3 + 1);
  });

  it('should handle overlap properly', async () => {
    const sim = Simulator({ clock, startTime: 86395 });

    sim.onOverlap = clock.stop;
    sim.start();
    await clock.done;

    expect(sim.time).toBe(MaxTick + 1);
  });

  it('should reset its internal ticker properly', async () => {
    const sim = Simulator({ clock, startTime: 99999 });

    sim.onOverlap = sim.reset;
    sim.onTick = (_, s) => s == 9 && clock.stop();
    sim.start();
    await clock.done;

    expect(sim.time).toBe(9 + 1);
  });

  it('should understand working hours aka shifts', async () => {
    const shiftEnd = 110;
    const [workStart, workEnd] = [100, 132];

    const sim = Simulator({
      clock,
      startTime: workStart,
      shift: [0, shiftEnd],
    });

    let skipped = 0;
    sim.onTick = (_, t, shift) => {
      !shift && skipped++;
      t >= workEnd && clock.stop();
    };
    sim.start();
    await clock.done;

    expect(skipped).toBe(workEnd - shiftEnd);
  });

  it('should handle shift change on-the-fly', async () => {
    // 100  109  150   181
    // ...................
    // ......x
    // --......-----------
    const [shift1Start, shift1End] = [100, 150];
    const [shift2Start, shift2End] = [105, 110];

    const [startTime, endTime] = [50, 181];
    const swapTime = 109;

    const sim = Simulator({
      clock,
      startTime,
      shift: [shift1Start, shift1End],
    });

    let ticked = 0;
    sim.onTick = (_, t, shift) => {
      shift && ticked++;
      t == swapTime && (sim.shift = [shift2Start, shift2End]);
      t == endTime && clock.stop();
    };
    sim.start();
    await clock.done;

    expect(ticked).toBe(Math.max(swapTime, shift2End) - shift1Start + 1);
  });

  it('should return correct event queue slices', async () => {
    const sim = Simulator({ clock });

    const end = 60;

    let [q10, q20, q30]: Action<string>[][] = [[], [], []];

    sim.queue = [
      { data: 0, time: 10, do: 'x' },
      { data: 0, time: 10, do: 'y' },
      { data: 0, time: 9, do: 'z' },
      { data: 0, time: 11, do: 'z' },
      { data: 0, time: 12, do: 'xx' },
      { data: 0, time: 30, do: 'yy' },
      { data: 0, time: 30, do: 'yy' },
      { data: 0, time: 30, do: 'yy' },
    ];
    sim.onTick = (q, t) => {
      t == 10 && (q10 = q);
      t == 20 && (q20 = q);
      t == 30 && (q30 = q);
      t == end && clock.stop();
    };
    sim.start();
    await clock.done;

    expect(q10).toHaveLength(2);
    expect(q20).toHaveLength(0);
    expect(q30).toHaveLength(3);
  });
});
