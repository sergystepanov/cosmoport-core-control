import { useCallback, memo } from 'react';
import { Button, NumericInput, Intent } from '@blueprintjs/core';

import styles from './Player.module.css';

type Props = {
  isPlaying: boolean;
  onEvent?: (op: string) => void;
  onPeriodChange: (minutes: number) => void;
  period: number;
};

export default memo(function PlayerControls({
  period = 0,
  isPlaying = false,
  onEvent = () => {},
  onPeriodChange = () => {},
}: Props) {
  const onClick = useCallback((e: any) => {
    const { op } = e.currentTarget.dataset;
    onEvent(op);
  }, []);

  return (
    <div className={styles.controls}>
      <div className={styles.periodBlock}>
        <NumericInput
          title="Here you can set a delay in minutes between tacks."
          className={styles.number}
          buttonPosition="none"
          placeholder={period + ''}
          onValueChange={onPeriodChange}
        />
        <span>m</span>
      </div>
      <Button minimal icon="step-forward" data-op="next" onClick={onClick} />
      <Button
        minimal
        intent={isPlaying ? Intent.WARNING : Intent.NONE}
        icon="play"
        data-op="play"
        onClick={onClick}
      />
      <Button minimal icon="stop" data-op="stop" onClick={onClick} />
      <Button minimal icon="pause" data-op="pause" onClick={onClick} />
      <Button minimal icon="volume-down" data-op="vol-" onClick={onClick} />
      <Button minimal icon="volume-up" data-op="vol+" onClick={onClick} />
    </div>
  );
});
