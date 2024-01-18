import React from 'react';
import { NavLink } from 'react-router-dom';

import { Alignment, Colors, Navbar } from '@blueprintjs/core';
import { Exchange, Lock, Unlock, Translate } from '@blueprintjs/icons';

import Player from '../player/Player';

type NavBar = {
  auth?: boolean;
  audio?: {
    dir: string;
    mp3s: string[];
  };
  nodes?: {
    timetables: number;
    gates: number;
  };
  simulation: boolean;
  clock: React.JSX.Element;
};

type Navigate = {
  to: string;
  icon: React.JSX.Element | string;
};

function Navigate({ to, icon }: Navigate) {
  return (
    <NavLink to={to} className="nav-link">
      {icon}
    </NavLink>
  );
}

export default function NavigationBar({
  auth = false,
  audio = { dir: '', mp3s: [] },
  nodes = { timetables: 0, gates: 0 },
  simulation = false,
  clock,
}: NavBar) {
  return (
    <Navbar style={{ cursor: 'default', position: 'fixed' }}>
      <Navbar.Group align={Alignment.LEFT}>
        <Navbar.Heading className="app-caption">Cosmoport</Navbar.Heading>
        <>
          <Navigate to="/" icon="Home" />
          <Navigate to="/simulation" icon="Simulation" />
          <Navigate to="/table" icon="Timetable" />
          {auth && (
            <Navigate
              to="/translation"
              icon={
                <>
                  <Translate /> Translation
                </>
              }
            />
          )}
          {auth && <Navigate to="/settings" icon="Settings" />}
          {!auth && <Navigate to="/login" icon={<Lock />} />}
          {auth && <Navigate to="/logout" icon={<Unlock />} />}
        </>
      </Navbar.Group>
      <Navbar.Group align={Alignment.RIGHT}>
        <Player dir={audio.dir} files={audio.mp3s} />
        <Navbar.Divider />
        <>{`${nodes.timetables}/${nodes.gates}`}</>
        <Navbar.Divider />
        <Exchange
          size={18}
          color={simulation ? Colors.GREEN4 : Colors.LIGHT_GRAY1}
          title={`Simulation is ${simulation ? 'ON' : 'OFF'}`}
        />
        <Navbar.Divider />
        {clock}
      </Navbar.Group>
    </Navbar>
  );
}
