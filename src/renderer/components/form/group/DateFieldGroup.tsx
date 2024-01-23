import React from 'react';

import { Classes, FormGroup } from '@blueprintjs/core';
import { DateInput3 } from '@blueprintjs/datetime2';

import styles from '../EventForm.module.css';

type Props = {
  caption: string;
  date?: string;
  name: string;
  onChange?: (name: string, date: string | null) => void;
  validator?: string;
};

export default function DateFieldGroup({
  caption,
  date = '',
  name,
  onChange = () => {},
  validator = '',
}: Props) {
  const handleDateChange = (date: string | null) => {
    onChange(name, date);
  };

  const invalid = validator !== '';
  const invalidMaybeClass = invalid ? ` ${Classes.INTENT_DANGER}` : '';

  return (
    <FormGroup
      inline
      className={`${invalidMaybeClass}`}
      label={
        <label
          htmlFor={name}
          className={`${Classes.LABEL} ${Classes.INLINE} ${styles.label_text_short}`}
        >
          <span>{caption}</span>
        </label>
      }
      {...(invalidMaybeClass && {
        contentClassName: invalidMaybeClass,
        helperText: validator,
      })}
    >
      <div id={name}>
        <DateInput3
          className={styles.fullWidth}
          dateFnsFormat={'yyyy-MM-dd'}
          value={date}
          showActionsBar
          onChange={handleDateChange}
        />
      </div>
    </FormGroup>
  );
}
