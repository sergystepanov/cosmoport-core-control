import { ReactNode, useCallback, useMemo, useState } from 'react';
import { Button, Icon, Slider, Tag } from '@blueprintjs/core';

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
  onClockRateChange: (x: number) => void;
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
  onClockRateChange = () => {},
}: Props) {
  const [showSchedule, setShowSchedule] = useState(false);
  const [speed, setSpeed] = useState(0);

  const handleShowScheduleClick = useCallback(
    () => setShowSchedule((s) => !s),
    [],
  );

  const handleActionClick = (action: CosmoAction) =>
    auth && onActionClick(action);

  // render announcements with the consecutive duplicates display
  const announcements = useMemo(() => {
    if (ann.length === 0) return <span>...</span>;
    const list = [];
    for (let i = 0, c = 1, k = 0; i < ann.length; i++, ++c) {
      const a = ann[i],
        b = ann[i + 1];
      if (a.id !== b?.id || a.type !== b?.type) {
        list.push(
          <span key={k++}>{`#${a.id} ${a.type}${c > 1 ? ' x' + c : ''}`}</span>,
        );
        c = 0;
      }
    }
    return list;
  }, [ann]);

  const actions = useMemo(() => {
    const actionInfo: ReactNode[] = [];

    const groupById = groupBy(
      simulation.actions,
      ({ event }: CosmoAction) => event.id,
    );
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
                {...(auth && {
                  interactive: true,
                  onClick: () => handleActionClick(action),
                })}
                className={`${styles.noSelect} ${doneMaybe}`}
                key={`${j}${i}`}
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

    return actionInfo;
  }, [auth, simulation.actions, simulation.minutes]);

  const help = useMemo(
    () => (
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
    ),
    [],
  );

  const renderPercentLabels = (value: number) =>
    `x${1000 / ((1000 - value) / (value > 0 ? 5 : 1) || 1)}`;

  return (
    <>
      {help}
      <p />
      <span className={styles.strong}>Simulation speed</span>
      <div style={{ width: '150px', margin: '10px 0 0 30px' }}>
        <Slider
          initialValue={0}
          stepSize={500}
          max={1000}
          min={0}
          value={speed}
          labelValues={[0, 500, 1000]}
          labelRenderer={renderPercentLabels}
          onChange={(value) => {
            setSpeed(value);
          }}
          onRelease={(value) => {
            onClockRateChange(1000 - value);
          }}
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
      <div className={styles.announcementInfo}>{announcements}</div>
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
        {actions}
      </div>
      <p />
    </>
  );
}
