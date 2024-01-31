import React from 'react';

import { Classes, FormGroup, Label } from '@blueprintjs/core';
import { DoubleCaretVertical } from '@blueprintjs/icons';

import styles from '../EventForm.module.css';

type Props = {
  caption?: string;
  children?: React.JSX.Element | React.JSX.Element[];
  disabled?: boolean;
  index?: number;
  name: string;
  onChange?: (
    name: string,
    val: number,
    ev: React.ChangeEvent<HTMLSelectElement>,
  ) => void;
  rightElement?: React.JSX.Element;
  validator?: string;
};

export default function ListFieldGroup({
  caption = '',
  children,
  disabled = false,
  index = 0,
  name,
  onChange = () => {},
  rightElement,
  validator = '',
}: Props) {
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(name, parseInt(event.target.value, 10), event);
  };

  const invalid = validator !== '';
  caption = caption !== '' ? caption : name;
  const invalidMaybeClass = invalid ? ` ${Classes.INTENT_DANGER}` : '';

  return (
    <FormGroup
      inline
      className={`${styles.field} ${invalidMaybeClass}`}
      label={
        <Label
          htmlFor={name}
          className={`${Classes.INLINE} ${styles.label_text}`}
        >
          {caption}
        </Label>
      }
      {...(invalidMaybeClass && {
        helperText: validator,
      })}
      contentClassName={`${styles.fullWidth}${invalidMaybeClass}`}
    >
      <div style={{ display: 'flex' }}>
        <div className={`${Classes.HTML_SELECT} ${Classes.FILL}`}>
          <select
            id={name}
            name={name}
            value={index}
            onChange={handleSelectChange}
            {...(disabled && { disabled })}
          >
            <option
              key={0}
              value={0}
            >{`Select a ${caption.toLowerCase()}...`}</option>
            {children}
          </select>
          <DoubleCaretVertical />
        </div>
        {rightElement && rightElement}
      </div>
    </FormGroup>
  );
}
