import React, { useEffect, useMemo, useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';

import { Button, FocusStyleManager } from '@blueprintjs/core';

import NavigationBar from '../components/navigation/NavigationBar';
import { Websocket } from '../api/Socket';
import { Api } from '../api/Api';
import Announcer, { PlayStatusType } from '../components/player/Announcer';
import MainPage from './MainPage';
import Table from './TableContainer';
import Simulation from './SimulationContainer';
import Translation from './TranslationContainer';
import Settings from './SettingsContainer';
import Lock from './LockContainer';
import Unlock from './UnlockContainer';
import EventMapper from '../components/mapper/EventMapper';
import _date from '../components/date/_date';
import Message from '../components/messages/Message';
import { defaultBusiness } from '../components/simulator/Defaults';

import CosmoportSimulator, {
  CosmoAction,
} from '../components/simulator/CosmoportSimulator';

import './app.global.css';
import styles from './App.module.css';
import {
  AnnouncementType,
  BusinessHoursType,
  EventType,
  SimulationDataType,
} from '../types/Types';
import ServerTime from '../components/time/ServerTime';
import { Clock } from '../components/time/Clock';

FocusStyleManager.onlyShowFocusOnTabs();

type Props = {
  api: Api;
  socket: Websocket;
  audio: {
    dir: string;
    mp3s: string[];
  };
};

type State = {
  boarding?: number;
  events: EventType[];
  nodes?: {
    gates: number;
    timetables: number;
  };
};

export default function App({
  api,
  socket,
  audio = { dir: '', mp3s: [] },
}: Props) {
  const [state, setState] = useState<State>({
    nodes: { gates: 0, timetables: 0 },
    boarding: 10,
    events: [],
  });

  const [auth, setAuth] = useState(false);
  const [announcement, setAnnouncement] = useState<{
    queue: Partial<AnnouncementType & { c: number }>[];
    status: PlayStatusType;
  }>({
    queue: [],
    status: 'PLAYING',
  });
  const [isDown, setIsDown] = useState(false);

  const [simulation, setSimulation] = useState<SimulationDataType>({
    active: false,
    actions: [],
    ticks: 0,
    minutes: 0,
  });

  // Does my waiting howl?
  let simulacra: ReturnType<typeof CosmoportSimulator>;

  // Time, alone we bide our time
  const clock = useMemo(() => Clock({ rate: 1000 }), []);

  api.onServerUnavailable = () => setIsDown(true);

  socket.onMessage = (message) => {
    console.debug(message);
    if (message === ':update-nodes:') {
      api
        .fetchNodes()
        .then((data) => setState((s) => ({ ...s, nodes: data })))
        .catch(console.error);
    }
  };

  const getData = () => {
    const today = _date.current();

    Promise.all([
      api.fetchTime(),
      api.fetchNodes(),
      api.fetchEventsInRange(today, today),
      api.fetchSettings(),
    ])
      .then(([time, nodes_, events_, settings_]) => {
        const settings = Array.isArray(settings_) ? settings_ : [];
        const events = Array.isArray(events_) ? events_ : [];

        const boardingTime =
          parseInt(
            settings.find((setting) => setting.param === 'boarding_time')
              ?.value,
            10,
          ) || 10;

        const business = settings.find(
          (setting) => setting.param === 'business_hours',
        )?.value;
        const todayBs = business ? JSON.parse(business) : defaultBusiness;
        const dayBs: BusinessHoursType =
          todayBs.hours[(new Date().getDay() + 6) % 7];

        const curMinutes = _date.toMinutes(new Date(time.timestamp * 1000));

        clock.timestamp = time.timestamp * 1000;

        if (simulacra) {
          simulacra.events = events;
          simulacra.business = dayBs.non ? null : [dayBs.start, dayBs.end];
          simulacra.reset(curMinutes);
        }

        setSimulation({
          active:
            !dayBs.non &&
            curMinutes >= dayBs.start &&
            (dayBs.end === 0 || curMinutes <= dayBs.end),
          minutes: curMinutes,
          ticks: simulacra.ticks,
          actions: simulacra.actions,
        });

        setState((s) => ({
          ...s,
          nodes: nodes_,
          events: events,
          boarding: boardingTime,
        }));

        setIsDown(false);

        return 1;
      })
      .catch(console.error);
  };

  useEffect(() => {
    getData();
    return () => {
      clock.stop();
      simulacra.stop();
    };
  }, []);

  const handleAnnouncement = (action: CosmoAction) => {
    setAnnouncement((s) => ({
      status: 'PLAYING',
      queue: s.queue.concat({
        id: action.event.id,
        time: new Date().getTime(),
        type: action.data,
      }),
    }));
  };

  const handleAnnouncementEnd = () => {
    announcement.queue.length > 0 &&
      setAnnouncement((s) => ({
        ...s,
        // remove last announcement
        queue: s.queue.filter((_, i) => i !== 0),
      }));
  };

  const handlePassword = (pass: string) => {
    api
      .authWith({ pwd: pass })
      .then((response) => {
        if (response.result) {
          setAuth(true);
          Message.show('Access was granted.');
        }
        return 1;
      })
      .catch(console.error);
  };

  const handleLogout = () => {
    setAuth(false);
    Message.show('Access was revoked.');
  };

  const handleStatusChange = (action: CosmoAction) => {
    setEventStatus(action);
  };

  const setEventStatus = (action: CosmoAction) => {
    if (!action.do || !action.event.eventStatusId) return;

    const { event } = action;
    const modifiedEvent = EventMapper.unmap(event);

    api
      .updateEvent(modifiedEvent)
      .then((result) =>
        Message.show(`Event status has been updated [${result.id}].`),
      )
      .catch(console.error);
  };

  const fireUpTheGate = (evt: EventType | undefined, tpy: string) => {
    api
      .proxy({ name: 'fire_gate', event: evt, type: tpy })
      .then(() => Message.show(`Firing up the Gate #${evt?.gateId}.`))
      .catch(console.error);
  };

  const handleStopAnnounce = () =>
    setAnnouncement({ queue: [], status: 'STOPPED' });

  const handleSimulationTick = (t: number, a?: boolean) => {
    console.debug(t, a);
    const curMinutes = _date.toMinutes(new Date(clock.timestamp));
    setSimulation((s) => ({
      ...s,
      ticks: t,
      active: !!a,
      minutes: curMinutes,
    }));
  };

  const handleRefresh = () => getData();

  const handleAction = (a: CosmoAction) => {
    console.info(a.do, a);
    switch (a.do) {
      case 'archive':
        break;
      case 'play_sound':
        handleAnnouncement(a);
        break;
      case 'set_status':
        handleStatusChange(a);
        break;
      case 'show_return':
        setEventStatus(a);
        fireUpTheGate(a.event, 'before_return');
        break;
      case 'turn_on_gate':
        fireUpTheGate(a.event, 'before_departion');
        break;
    }
  };

  simulacra = useMemo(() => {
    const s = CosmoportSimulator({
      clock,
      onAction: handleAction,
      onTick: handleSimulationTick,
    });
    s.onOverlap = () => {
      console.log('overlap');
      handleRefresh();
    };
    s.events = state.events;
    s.start();
    return s;
  }, []);

  console.log('render app');

  const { boarding, events: events_, nodes } = state;

  const commonProps = {
    api,
    auth,
    pre: boarding,
    onRefresh: handleRefresh,
  };

  return (
    <>
      {isDown ? (
        <>
          {'Server is not available :('}
          <Button
            text="Reload"
            onClick={() => {
              getData();
            }}
          />
        </>
      ) : (
        <>
          <Announcer
            audioPath={audio.dir}
            status={announcement.status}
            announcements={announcement.queue}
            onAnnouncementEnd={handleAnnouncementEnd}
          />
          <Router>
            <div className={styles.container}>
              <NavigationBar
                nodes={nodes}
                audio={audio}
                auth={auth}
                simulation={simulation.active}
                clock={<ServerTime clock={clock} />}
              />
              <div className={styles.content}>
                <Routes>
                  <Route path="/" element={<MainPage {...commonProps} />} />
                  <Route
                    path="/simulation"
                    element={
                      <Simulation
                        simulation={simulation}
                        announcements={announcement.queue}
                        onActionClick={handleAction}
                        onStopAnnounce={handleStopAnnounce}
                        events={events_}
                        {...commonProps}
                      />
                    }
                  />
                  <Route
                    path="/translation"
                    element={<Translation {...commonProps} />}
                  />
                  <Route path="/table" element={<Table {...commonProps} />} />
                  <Route
                    path="/login"
                    element={<Unlock onAuth={handlePassword} />}
                  />
                  <Route
                    path="/logout"
                    element={<Lock onDeAuth={handleLogout} />}
                  />
                  <Route
                    path="/settings"
                    element={<Settings {...commonProps} />}
                  />
                </Routes>
              </div>
            </div>
          </Router>
          <Message.render />
        </>
      )}
    </>
  );
}
