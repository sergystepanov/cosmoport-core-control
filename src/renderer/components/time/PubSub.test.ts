import PubSub from './PubSub';

describe('Test Pub/Sub implementation', () => {
  it('should pub/sub properly', () => {
    const e = PubSub();

    let counter = 0;
    const x = e.sub('x', () => counter++);
    for (let i = 0; i < 3; i++) e.pub('x');
    x.unsub();
    for (let i = 0; i < 3; i++) e.pub('x');

    expect(counter).toBe(3);
  });
});
