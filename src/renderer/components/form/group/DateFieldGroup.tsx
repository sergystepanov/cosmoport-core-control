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
      className={`${styles.field} ${invalidMaybeClass}`}
      label={<span className={`${styles.label_text}`}>{caption}</span>}
      labelFor={name}
      {...(invalidMaybeClass && {
        contentClassName: invalidMaybeClass,
        helperText: validator,
      })}
      contentClassName={styles.fullWidth}
    >
      <div id={name} className={styles.fullWidth}>
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
