import React from 'react';

import { NumericInput, Intent, FormGroup } from '@blueprintjs/core';

import styles from '../EventForm.module.css';

type Props = {
  caption?: string;
  className?: string;
  icon?: any;
  info?: string;
  inline?: boolean;
  leftElement?: React.JSX.Element;
  name: string;
  number?: number;
  onChange: (name: string, val: number) => void;
  rightElement?: React.JSX.Element;
  validator?: string;
};

export default function NumberFieldGroup({
  caption = '',
  className = '',
  icon,
  info = '',
  inline = false,
  leftElement,
  name,
  number,
  onChange = () => {},
  rightElement,
  validator = '',
}: Props) {
  const handleValueChange = (value: number) => onChange(name, value);

  const intent = validator !== '' ? Intent.DANGER : Intent.NONE;

  return (
    <FormGroup
      className={`${className} ${styles.field}`}
      contentClassName={styles.fill}
      inline={inline}
      labelFor={name}
      labelInfo={info}
      label={caption || name}
      helperText={validator}
      intent={intent}
    >
      <NumericInput
        id={name}
        allowNumericCharactersOnly
        intent={intent}
        buttonPosition="none"
        leftIcon={icon}
        leftElement={leftElement}
        rightElement={rightElement}
        min={0}
        fill
        value={number}
        onValueChange={handleValueChange}
      />
    </FormGroup>
  );
}
