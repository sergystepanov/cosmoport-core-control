import { ReactNode, useState } from 'react';
import { Button, Icon, Tag } from '@blueprintjs/core';

import GateSchedule from '../components/simulator/GateSchedule';
import _date from '../components/date/_date';

import {
  AnnouncementType,
  EventType,
  SimulationDataType,
} from '../types/Types';

import styles from '../components/simulator/Simulator.module.css';
import { CosmoAction } from '../components/simulator/CosmoportSimulator';

const groupBy = (values: any, prop: any) =>
  values.reduce((a: any, b: any) => {
    const key = typeof prop === 'function' ? prop(b) : b[prop];
    a[key] = !a[key] ? [b] : [...a[key], b];
    return a;
  }, {});

type Props = {
  auth?: boolean;
  events?: EventType[];
  announcements: Partial<AnnouncementType & { c: number }>[];
  simulation: SimulationDataType;
  onActionClick: (action: CosmoAction) => void;
  onStopAnnounce: () => void;
};

export default function SimulationContainer({
  auth = false,
  simulation = {
    active: false,
    ticks: 0,
    actions: [],
    minutes: 0,
  },
  announcements: ann = [],
  events = [],
  onActionClick = () => {},
  onStopAnnounce = () => {},
}: Props) {
  const [showSchedule, setShowSchedule] = useState(false);

  const handleShowScheduleClick = () => {
    setShowSchedule(!showSchedule);
  };

  const handleActionClick = (action: CosmoAction) =>
    auth && onActionClick(action);

  const hasAnnouncements = ann.length > 0;

  let c = 0;
  const grouped: Partial<AnnouncementType & { c: number }>[] = [];
  ann.forEach((a) => {
    const last = grouped[grouped.length - 1];
    if (!grouped.length || a.id !== last.id || a.type !== last.type) {
      a.c = c;
      c = 0;
      grouped.push(a);
    } else {
      // @ts-ignore
      grouped[grouped.length - 1].c++;
    }
  });

  const announcementList = hasAnnouncements ? (
    grouped.map((a, i) => (
      <Tag minimal key={i}>{`#${a.id} ${a.type}${
        a.c ? ' x' + (a.c + 1) : ''
      }`}</Tag>
    ))
  ) : (
    <div>...</div>
  );

  const groupById = groupBy(
    simulation.actions,
    ({ event }: CosmoAction) => event.id,
  );

  const actionInfo: ReactNode[] = [];

  Object.keys(groupById).forEach((id, j) => {
    const line = [];
    line.push(<div key={`h${j}`}>#{id}</div>);
    const actions = groupById[id];

    line.push(
      <div key={j} className={styles.actionList}>
        {actions.map((action: CosmoAction, i: number) => {
          let destination = '';
          if (action.do === 'turn_on_gate') {
            destination = `(G${action.event.gateId}) `;
          } else if (action.do === 'show_return') {
            destination = `(G${action.event.gate2Id}) `;
          }

          const m = action.time / 60; // convert to minutes
          const time = _date.minutesToHm(m);
          const doneMaybe = m < simulation.minutes ? styles.done : '';

          return (
            <Tag
              minimal
              {...(auth && { interactive: true })}
              className={`${styles.noSelect} ${doneMaybe}`}
              key={`${j}${i}`}
              {...(auth && {
                onClick: () => handleActionClick(action),
              })}
            >
              {`${time} ${action.do} ${action.data ?? ''} ${destination}`}
            </Tag>
          );
        })}
      </div>,
    );
    actionInfo.push(
      <div key={`l${j}`} className={styles.actionListRecord}>
        {line}
      </div>,
    );
  });

  return (
    <>
      <div className={styles.cap}>
        <Icon
          icon="help"
          style={{ color: '#97a4b7' }}
          size={20}
          title={`Here you can control the system simulation somewhat.
          Be aware it will change statuses of events. 
          After you enter the password, you can use all the actions.`}
        />
      </div>
      <p />
      <span className={styles.strong}>Announcements</span>
      <Button
        minimal
        small
        rightIcon="cross"
        text="stop all"
        onClick={onStopAnnounce}
      />
      <div className={styles.announcementInfo}>{announcementList}</div>
      <p />
      <div>
        <span className={styles.strong}>Simulation ticks</span>
        <div className={styles.simulationInfo}>
          <Icon
            className={simulation.active ? styles.heart : ''}
            icon="heart"
          />
          <span>{simulation.minutes}/1440</span>
          <Button
            minimal
            small
            icon={showSchedule ? 'caret-down' : 'caret-right'}
            text="Show schedule infographic"
            onClick={handleShowScheduleClick}
          />
        </div>
        {showSchedule && (
          <GateSchedule events={events} minutes={simulation.minutes} />
        )}
        <p />
        <span className={styles.strong}>Event list</span>
        <div>{actionInfo}</div>
      </div>
      <p />
    </>
  );
}
