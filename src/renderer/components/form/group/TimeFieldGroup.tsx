import { Classes, FormGroup, Label } from '@blueprintjs/core';
import { TimePicker } from '@blueprintjs/datetime';

import _date from '../../../components/date/_date';

import styles from '../EventForm.module.css';

type Props = {
  name: string;
  caption: string;
  minutes?: number;
  onChange?: (name: string, val: number) => void;
  validator?: string;
};

export default function TimeFieldGroup({
  name,
  caption,
  minutes = 0,
  onChange = () => {},
  validator = '',
}: Props) {
  const handleTimeChange = (date: Date) => {
    onChange(name, _date.toMinutes(date));
  };

  return (
    <FormGroup
      {...(validator !== '' && {
        helperText: validator,
        className: Classes.INTENT_DANGER,
        contentClassName: Classes.INTENT_DANGER,
      })}
      label={
        <Label htmlFor={name} className={styles.label_text_short}>
          {caption}
        </Label>
      }
    >
      <div id={name}>
        <TimePicker
          className={styles.noPadding}
          value={_date.toDate(minutes)}
          onChange={handleTimeChange}
        />
      </div>
    </FormGroup>
  );
}
