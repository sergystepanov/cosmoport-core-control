import { useState } from 'react';

import { Button } from '@blueprintjs/core';

import BusinessDayEditor from './BusinessDayEditor';
import _date from '../../../components/date/_date';
import { BusinessHoursType } from '../../../types/Types';

type Props = {
  setting: {
    id: number;
    param: string;
    value: string;
  };
  onSet: (id: number, val: string) => void;
};

export default function BusinessHours({ setting, onSet }: Props) {
  const unMarshal = (text: string) => JSON.parse(text);
  const marshal = (json: any) => JSON.stringify(json);

  const [state, setState] = useState(unMarshal(setting.value));

  const handleChange = (day: BusinessHoursType, value: Date, what: any) => {
    const el = state.hours.findIndex(
      (e: BusinessHoursType) => e.day === day.day,
    );
    const old = state.hours[el][what];
    const new_ = _date.toMinutes(value);

    if (old !== new_) {
      state.hours[el][what] = new_;
    }
  };

  const handleSwitch = (day: BusinessHoursType) => {
    const el = state.hours.findIndex(
      (e: BusinessHoursType) => e.day === day.day,
    );
    setState((s: any) => {
      const hh = s.hours;
      hh[el].non = !hh[el].non;
      return { ...s, hours: hh };
    });
  };

  const handleClick = () => {
    onSet(setting.id, marshal(state));
  };

  const { hours: days } = state;

  return (
    <>
      {days.map((day_: BusinessHoursType) => (
        <BusinessDayEditor
          key={day_.day}
          day={day_}
          onChange={handleChange}
          onSwitch={handleSwitch}
        />
      ))}
      <Button
        style={{ marginLeft: '15em', marginTop: '1em', width: '7em' }}
        text="Set"
        onClick={handleClick}
      />
    </>
  );
}
