import React from 'react';
import { Switch } from '@blueprintjs/core';
import { TimePicker } from '@blueprintjs/datetime';

import _date from '../../../components/date/_date';
import { BusinessHoursType } from '../../../types/Types';

type Props = {
  day: BusinessHoursType;
  onChange: (b: BusinessHoursType, d: Date, t: string) => void;
  onSwitch: (o: BusinessHoursType, v: boolean) => void;
};

export default function BusinessDayEditor({ day, onChange, onSwitch }: Props) {
  const handleChangeStart = (value: Date) => {
    onChange(day, value, 'start');
  };

  const handleChangeEnd = (value: Date) => {
    onChange(day, value, 'end');
  };

  const handleSwitch = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSwitch(day, !(event.target.value === 'on'));
  };

  const active = day.non ? { disabled: true } : {};

  return (
    <div key={day.day} style={{ display: 'flex', gap: '.5em' }}>
      <span style={{ width: '2.5em' }}>{day.day}</span>
      <TimePicker
        {...active}
        defaultValue={_date.toDate(day.start)}
        selectAllOnFocus
        onChange={handleChangeStart}
      />
      <TimePicker
        {...active}
        defaultValue={_date.toDate(day.end)}
        selectAllOnFocus
        onChange={handleChangeEnd}
      />
      <Switch
        defaultChecked={!day.non}
        onChange={handleSwitch}
        label="Working"
      />
    </div>
  );
}
