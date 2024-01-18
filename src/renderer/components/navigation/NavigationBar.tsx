import React from 'react';
import { NavLink } from 'react-router-dom';

import { Alignment, Colors, Navbar } from '@blueprintjs/core';
import { Exchange, Lock, Unlock, Translate } from '@blueprintjs/icons';

type NavBar = {
  auth?: boolean;
  nodes?: {
    timetables: number;
    gates: number;
  };
  simulation: boolean;
  player: React.JSX.Element;
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
  nodes = { timetables: 0, gates: 0 },
  simulation = false,
  clock,
  player,
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
        {player}
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
