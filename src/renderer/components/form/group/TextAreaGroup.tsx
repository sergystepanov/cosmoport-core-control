import React from 'react';

import { Classes, FormGroup, Label } from '@blueprintjs/core';

import styles from '../EventForm.module.css';

type Props = {
  caption?: string;
  className?: string;
  disabled?: boolean;
  inline?: boolean;
  name: string;
  noLabel?: boolean;
  onChange?: (name: string, val: string) => void;
  placeholder?: string;
  validator?: string;
  value: string;
};

export default function TextAreaGroup({
  caption = '',
  className = '',
  disabled = false,
  inline = false,
  name,
  noLabel = false,
  onChange = () => {},
  placeholder = '',
  validator = '',
  value = '',
}: Props) {
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(name, event.target.value);
  };

  const invalid = validator !== '';
  if (caption === '') caption = name;
  const invalidMaybe = invalid ? ' ' + Classes.INTENT_DANGER : '';

  return (
    <FormGroup
      inline={inline}
      className={`${invalidMaybe} ${className}`}
      {...(!noLabel && {
        label: (
          <Label
            htmlFor={name}
            className={`${Classes.INLINE} ${styles.label_text}`}
          >
            {caption}
          </Label>
        ),
      })}
      contentClassName={`${styles.fullWidth}${invalidMaybe}`}
      {...(invalid && { helperText: validator })}
    >
      <textarea
        id={name}
        className={`${Classes.INPUT} ${styles.fill} ${invalidMaybe}`}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
      />
    </FormGroup>
  );
}
