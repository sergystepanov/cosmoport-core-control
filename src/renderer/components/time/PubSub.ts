export default function PubSub<T>() {
  const topics: { [index: string]: { [index: string]: (data?: T) => void } } =
    {};

  // internal listener index
  let i = 0;

  return {
    /**
     * Subscribes onto some event.
     *
     * @param topic The name of the event.
     * @param listener A callback function to call during the event.
     * @returns The function to remove this subscription.
     *
     * @example
     * const sub01 = event.sub('rapture', () => {a}, 1)
     * ...
     * sub01.unsub()
     */
    sub: (topic: string, listener: (d?: T) => void = () => {}) => {
      const ii = i++;
      (topics[topic] ||= {})[ii] = listener;
      return { unsub: () => delete topics[topic][ii] };
    },

    /**
     * Publishes some event.
     *
     * @param topic The name of the event.
     * @param data Additional data for the event handling.
     *
     * @example
     * event.pub('rapture', {time: now()})
     */
    pub: (topic: string, data?: T) => {
      Object.values(topics[topic] || {}).forEach((cb) => cb(data));
    },
  };
}
