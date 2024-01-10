import { useEffect, useRef, useState } from 'react';
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
import Simulator from '../components/simulator/Simulator';
import EventMapper from '../components/mapper/EventMapper';
import _date from '../components/date/_date';
import Message from '../components/messages/Message';
import { defaultBusiness } from '../components/simulator/Defaults';

import './app.global.css';
import styles from './App.module.css';
import {
  AnnouncementType,
  BusinessHoursType,
  EventType,
  SimulationActionType,
  SimulationDataType,
} from '../types/Types';

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
  auth?: boolean;
  audio2?: { path: string; files: string[] };
  boarding?: number;
  bs: BusinessHoursType;
  events?: EventType[];
  nodes?: {
    gates: number;
    timetables: number;
  };
  serverIsDown?: boolean;
  timestamp?: number;
  simulation: SimulationDataType;
  simulationAnnouncements: Partial<AnnouncementType & { c: number }>[];
  simulationAnnouncementsPlay: PlayStatusType;
};

export default function App({
  api,
  socket,
  audio = { dir: '', mp3s: [] },
}: Props) {
  const [state, setState] = useState<State>({
    timestamp: 0,
    nodes: { gates: 0, timetables: 0 },
    boarding: 10,
    bs: {
      start: 0,
      end: 0,
      non: false,
    },
    events: [],
    audio2: { path: audio.dir, files: audio.mp3s },
    serverIsDown: false,
    simulationAnnouncements: [],
    simulationAnnouncementsPlay: 'PLAYING',
    simulation: {
      active: true,
      actions: [],
      ticks: 0,
    },
    auth: false,
  });

  api.onServerUnavailable = () => {
    setState({ ...state, serverIsDown: true });
  };

  socket.onMessage = (message) => {
    console.debug(message);
    if (message === ':update-nodes:') {
      api
        .fetchNodes()
        .then((data) => setState({ ...state, nodes: data }))
        .catch(console.error);
    }
  };

  const getData = () => {
    const { simulation } = state;
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
        const dayBs = todayBs.hours[(new Date().getDay() + 6) % 7];

        setState({
          ...state,
          timestamp: time.timestamp,
          nodes: nodes_,
          events: events,
          boarding: boardingTime,
          bs: dayBs,
          simulation: {
            active: simulation.active,
            actions: simulatorRef.current?.scheduleActions(events),
            ticks: simulation.ticks,
          },
          serverIsDown: false,
        });

        return 1;
      })
      .catch(console.error);
  };

  useEffect(() => {
    getData();
  }, []);

  const simulatorRef = useRef<Simulator | null>(null);

  const handleAnnouncement = (ann: AnnouncementType) => {
    setState({
      ...state,
      simulationAnnouncementsPlay: 'PLAYING',
      simulationAnnouncements: state.simulationAnnouncements.concat(ann),
    });
    console.info('announcement', ann.type);
  };

  const handleAnnouncementEnd = () => {
    if (state.simulationAnnouncements.length > 0) {
      // Remove last announcement
      setState({
        ...state,
        simulationAnnouncements: state.simulationAnnouncements.filter(
          (_, i) => i !== 0,
        ),
      });
    }
  };

  const handlePassword = (pass: string) => {
    api
      .authWith({ pwd: pass })
      .then((response) => {
        if (response.result) {
          setState({ ...state, auth: true });
          Message.show('Access was granted.');
        }
        return 1;
      })
      .catch(console.error);
  };

  const handleLogout = () => {
    setState({ ...state, auth: false });
    Message.show('Access was revoked.');
  };

  const handleStatusChange = (action: SimulationActionType) => {
    console.info('status', action);
    setEventStatus(action.event, action);
  };

  const setEventStatus = (event: EventType, action: SimulationActionType) => {
    // Be careful with these values
    const statusIdMap = {
      set_status_boarding: 2,
      set_status_departed: 3,
      show_return: 4,
      set_status_returned: 5,
    }[action.do];

    if (!statusIdMap) return;

    const ev = event;
    ev.eventStatusId = statusIdMap;
    const modifiedEvent = EventMapper.unmap(ev);

    api
      .updateEvent(modifiedEvent)
      .then((result) =>
        Message.show(`Event status has been updated [${result.id}].`),
      )
      .catch(console.error);
  };

  const handleTurnGateOn = (action: SimulationActionType) => {
    console.info('gateOn', action);
    fireUpTheGate(action.event, 'before_departion');
  };

  const fireUpTheGate = (evt: EventType, tpy: string) => {
    api
      .proxy({ name: 'fire_gate', event: evt, type: tpy })
      .then(() => Message.show(`Firing up the Gate #${evt.gateId}.`))
      .catch(console.error);
  };

  const handleArchive = (action: SimulationActionType) => {
    console.info('archive', action);
  };

  const handleReturn = (action: SimulationActionType) => {
    console.info('return', action);
    setEventStatus(action.event, action);
    fireUpTheGate(action.event, 'before_return');
  };

  const handleAction = (action: SimulationActionType) => {
    simulatorRef.current?.doIt(action);
  };

  const handleStopAnnounce = () => {
    setState({
      ...state,
      simulationAnnouncements: [],
      simulationAnnouncementsPlay: 'STOPPED',
    });
  };

  const handleSimulationTick = (simulation: SimulationDataType) => {
    setState({ ...state, simulation: simulation });
  };

  const handleRefresh = () => getData();

  const handleActionsUpdate = (actions_: SimulationActionType[]) => {
    if (actions_ !== state.simulation.actions) {
      const newSimulation = { ...state.simulation, actions: actions_ };
      setState({ ...state, simulation: newSimulation });
    }
  };

  const {
    auth,
    boarding,
    bs,
    events: events_,
    serverIsDown,
    simulation: sim,
    simulationAnnouncements: sa,
    simulationAnnouncementsPlay: playStatus,
    timestamp,
    nodes,
    audio2,
  } = state;

  const commonProps = {
    api,
    auth,
    pre: boarding,
    onRefresh: handleRefresh,
  };

  // TODO fix simulation

  return (
    <>
      <Simulator
        ref={simulatorRef}
        events={events_}
        boarding={boarding}
        business={bs}
        onAnnouncement={handleAnnouncement}
        onStatusChange={handleStatusChange}
        onTurnGateOn={handleTurnGateOn}
        onArchive={handleArchive}
        onReturn={handleReturn}
        onSimulationTick={handleSimulationTick}
        onNewDay={handleRefresh}
        onActionsUpdate={handleActionsUpdate}
      />
      {serverIsDown ? (
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
            audio={audio2}
            status={playStatus}
            announcements={sa}
            onAnnouncementEnd={handleAnnouncementEnd}
          />
          <Router>
            <div className="bp5-ui-text">
              <div className={styles.container}>
                <NavigationBar
                  timestamp={timestamp}
                  nodes={nodes}
                  audio={audio2}
                  auth={auth}
                  simulation={sim.active}
                />
                <div className={styles.content}>
                  <Routes>
                    <Route path="/" element={<MainPage {...commonProps} />} />
                    <Route
                      path="/simulation"
                      element={
                        <Simulation
                          simulation={sim}
                          announcements={sa}
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
            </div>
          </Router>
          <Message.render />
        </>
      )}
    </>
  );
}
