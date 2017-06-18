import React, { PureComponent } from 'react';

import styles from './GateSchedule.css';

const groupByGate = (events, prop) => events.reduce((r, a) => {
  r[a[prop]] = r[a[prop]] || [];
  r[a[prop]].push(a);
  return r;
}, Object.create(null));

export default class GateSchedule extends PureComponent {
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.events !== nextProps.events;
  }

  draw1440 = (lines) => {
    // const start = new Date().getTime();
    const rez = [];

    for (let i = 0; i < 1441; i++) {
      const set = lines.find(e => (i >= e.startTime) && (i <= (e.startTime + e.durationTime)));
      rez.push(set ? <span key={i} className={styles.set} /> : <span key={i} />);
    }

    // console.info('draw1440', (new Date().getTime() - start));

    return rez;
  }

  render() {
    const { events } = this.props;
    const mapping = Object.assign({}, groupByGate(events, 'gateId')/* , groupByGate(events, 'gate2Id')*/);
    const gates = Object.keys(mapping).map(key =>
      (<div key={key} className={styles.container} style={{ marginBottom: '1em' }}>
        <div>{key}</div>
        <div className={styles.container}>{this.draw1440(mapping[key])}</div>
      </div>)
    );

    return (<div>
      <div>
        Very slow render of the events duration across all the gates (lol) (gates #2 not included).
      </div>
      <div className={styles.container}>
        {gates}
      </div>

    </div>);
  }
}
