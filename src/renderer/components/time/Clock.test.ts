import { Clock } from './Clock';

describe('Test clock', () => {
  it('should tick', async () => {
    let ticks = 0;
    const clock = Clock({ rate: 10 });
    clock.onTick((t) => {
      if (t === 3) {
        ticks = t;
        clock.stop();
      }
    });
    await clock.done;
    expect(ticks).toBe(3);
  });

  it('should handle several subscribers', async () => {
    const clock = Clock({ rate: 1 });

    let t1 = 0;
    let t2 = 0;
    let t3 = 0;
    let t4 = 0;

    type subs = { unsub: () => void };

    let s1: subs, s2: subs;

    s1 = clock.onTick(() => t1++ && t1 === 3 && s2.unsub());
    s2 = clock.onTick(() => t2++);
    clock.onTick(() => {
      t3++;
      t3 === 5 && s1.unsub();
      t3 === 6 && clock.onTick(() => t4++);
      t3 === 7 && clock.stop();
    });

    await clock.done;

    expect(t1).toBe(5);
    expect(t2).toBe(3);
    expect(t3).toBe(7);
    expect(t4).toBe(1);
  });
});
