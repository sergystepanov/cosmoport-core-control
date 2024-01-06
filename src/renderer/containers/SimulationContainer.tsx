import { ReactNode, useState } from 'react';
import { Button, Classes, Icon, Popover, Tag } from '@blueprintjs/core';

import GateSchedule from '../components/simulator/GateSchedule';
import _date from '../components/date/_date';

import {
  AnnouncementType,
  EventType,
  SimulationActionType,
  SimulationDataType,
} from '../types/Types';

import styles from '../components/simulator/Simulator.module.css';

const groupBy = (values: any, prop: any) =>
  values.reduce((a: any, b: any) => {
    const key = typeof prop === 'function' ? prop(b) : b[prop];
    a[key] = !a[key] ? [b] : [...a[key], b];
    return a;
  }, {});

type Props = {
  auth: boolean;
  events: EventType[];
  announcements: (AnnouncementType & { c: number })[];
  simulation: SimulationDataType;
  onActionClick: (action: SimulationActionType) => void;
  onStopAnnounce: () => void;
};

export default function SimulationContainer({
  auth = false,
  simulation = {
    active: false,
    ticks: 0,
    actions: [],
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

  const handleActionClick = (action: SimulationActionType) =>
    auth && onActionClick(action);

  const minutes = _date.toMinutes(new Date());
  const hasAnnouncements = ann.length > 0;

  let c = 0;
  const grouped: (AnnouncementType & { c: number })[] = [];
  ann.forEach((a) => {
    const last = grouped[grouped.length - 1];
    if (!grouped.length || a.id !== last.id || a.type !== last.type) {
      a.c = c;
      c = 0;
      grouped.push(a);
    } else {
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
    ({ event }: SimulationActionType) => event.id,
  );

  const actionInfo: ReactNode[] = [];

  Object.keys(groupById).forEach((id, j) => {
    const line = [];
    line.push(<div key={`h${j}`}>#{id}</div>);
    const actions = groupById[id];

    line.push(
      <div key={j} className={styles.actionList}>
        {actions.map((action: SimulationActionType, i: number) => {
          let destination = '';
          if (action.do === 'turn_on_gate') {
            destination = `(G${action.event.gateId}) `;
          } else if (action.do === 'show_return') {
            destination = `(G${action.event.gate2Id}) `;
          }

          const time = _date.minutesToHm(action.time);
          const doneMaybe = action.time < minutes ? styles.done : '';

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
              {`${time} ${action.do} ${destination}`}
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
        <Popover
          interactionKind="hover"
          popoverClassName={Classes.POPOVER_CONTENT_SIZING}
          placement="left-start"
          content={`Here you can control the system simulation somewhat. Be aware it
              will change statuses of events. After you enter the password,
              you can use all the actions.`}
          renderTarget={({ isOpen, ...targetProps }) => (
            <span {...targetProps}>
              <Icon icon="help" style={{ color: '#97a4b7' }} size={20} />
            </span>
          )}
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
          <span>
            <Icon
              className={simulation.active ? styles.heart : ''}
              icon="heart"
            />
            {simulation.ticks > 0 && simulation.ticks}
          </span>
          <span>{minutes}/1440</span>
          <div>
            <Button
              minimal
              small
              icon={showSchedule ? 'caret-down' : 'caret-right'}
              text="Show schedule infographic"
              onClick={handleShowScheduleClick}
            />
          </div>
        </div>
        {showSchedule && <GateSchedule events={events} minutes={minutes} />}
        <p />
        <span className={styles.strong}>Event list</span>
        <div>{actionInfo}</div>
      </div>
      <p />
    </>
  );
}
