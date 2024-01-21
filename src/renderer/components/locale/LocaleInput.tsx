import { NumericInput, Checkbox } from '@blueprintjs/core';

import styles from './LocaleInput.module.css';
import { LocaleDescriptionType } from '../../types/Types';

type Props = {
  locale: LocaleDescriptionType;
  onChange?: (locale: LocaleDescriptionType, value: number) => void;
  onCheck?: (locale: LocaleDescriptionType, value: boolean) => void;
};

export default function LocaleInput({
  locale,
  onChange = () => {},
  onCheck = () => {},
}: Props) {
  const handleValueChange = (value: number) => {
    onChange(locale, value);
  };

  const handleCheck = () => {
    onCheck(locale, !locale.show);
  };

  const checkBox = locale.default ? (
    <Checkbox
      key={1}
      className={styles.locale}
      checked={locale.show}
      label={locale.code}
      disabled
    />
  ) : (
    <Checkbox
      key={1}
      className={styles.locale}
      checked={locale.show}
      label={locale.code}
      onChange={handleCheck}
    />
  );

  return (
    <div className={styles.container}>
      {checkBox}
      <NumericInput
        id={locale.id + ''}
        className={styles.input}
        allowNumericCharactersOnly
        buttonPosition={'none'}
        min={0}
        value={locale.showTime}
        onValueChange={handleValueChange}
      />
      <span>s</span>
    </div>
  );
}
