import { Button, NumericInput, Intent } from '@blueprintjs/core';

import styles from './Player.module.css';

const nop = () => ({});

type Props = {
  isPlaying: boolean;
  onNext: () => void;
  onPause: () => void;
  onPeriodChange: (minutes: number) => void;
  onPlay: () => void;
  onStop: () => void;
  onVolumeDown: () => void;
  onVolumeUp: () => void;
  period: number;
};

export default function PlayerControls({
  period = 0,
  isPlaying = false,
  onPeriodChange = nop,
  onNext = nop,
  onPlay = nop,
  onStop = nop,
  onPause = nop,
  onVolumeDown = nop,
  onVolumeUp = nop,
}: Props) {
  return (
    <div className={styles.controls}>
      <div className={styles.periodBlock}>
        <NumericInput
          title="Here you can set a delay in minutes between tacks."
          className={styles.number}
          buttonPosition="none"
          value={period}
          onValueChange={onPeriodChange}
        />
        <span>m</span>
      </div>
      <Button minimal icon="step-forward" onClick={onNext} />
      <Button
        minimal
        intent={isPlaying ? Intent.WARNING : Intent.NONE}
        icon="play"
        onClick={onPlay}
      />
      <Button minimal icon="stop" onClick={onStop} />
      <Button minimal icon="pause" onClick={onPause} />
      <Button minimal icon="volume-down" onClick={onVolumeDown} />
      <Button minimal icon="volume-up" onClick={onVolumeUp} />
    </div>
  );
}
