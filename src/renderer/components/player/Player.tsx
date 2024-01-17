import { useState, useEffect, memo } from 'react';
import Sound from 'react-sound';

import PlayerControls from './PlayerControls';

import styles from './Player.module.css';

const shuffle = (ar: string[]) => {
  for (let i = ar.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = ar[i];
    ar[i] = ar[j];
    ar[j] = temp;
  }
};

const buildUrl = (path: string, track: string) => `media:///${path}/${track}`;

enum PLAYER {
  PLAYING = 'PLAYING',
  STOPPED = 'STOPPED',
  PAUSED = 'PAUSED',
}

type Props = {
  dir: string;
  files: string[];
};

export default memo(function Player({ dir = '', files = [] }: Props) {
  const [volume, setVolume] = useState(20);
  const [wait, setWait] = useState(1);
  const [playlist, setPlaylist] = useState(files);
  const [trackNo, setTrackNo] = useState(0);
  const [player, setPlayer] = useState({
    status: PLAYER.STOPPED,
    isWait: false,
    pos: 0,
  });

  let t: ReturnType<typeof setTimeout>;

  useEffect(() => {
    shuffle(files);
    setPlaylist(files);
    next();
    return () => {
      setPlayer({ status: PLAYER.STOPPED, isWait: false, pos: 0 });
      clearTimeout(t);
    };
  }, [dir, files]);

  useEffect(() => {
    if (!player.isWait) return;

    next();
    t = setTimeout(
      () => {
        setPlayer({ status: PLAYER.PLAYING, isWait: false, pos: 0 });
      },
      wait * 1000 * 60,
    );
  }, [player]);

  const next = () => setTrackNo((trackNo + 1) % (files.length - 1));

  const handlePeriodChange = (minutes: number) => setWait(minutes);

  const handleFinish = () => {
    setPlayer({ ...player, status: PLAYER.STOPPED, isWait: true });
  };

  const handlePlay = () => {
    setPlayer({ ...player, status: PLAYER.PLAYING, isWait: false });
  };

  const handleStop = () => {
    clearTimeout(t);
    setPlayer({ status: PLAYER.STOPPED, isWait: false, pos: 0 });
  };

  const handlePause = () => {
    clearTimeout(t);
    setPlayer({ ...player, status: PLAYER.PAUSED, isWait: false });
  };

  const track = playlist[trackNo] || '';
  const hasTrack = track !== '' && files.length > 0;
  const trackTitle = track.replace('.mp3', '');
  const trackStatus = player.isWait
    ? `waiting (${wait} m)`
    : player.status.toLowerCase() || '(unknown)';

  return (
    <div className={`${styles.centred} ${styles.overlay}`}>
      <PlayerControls
        isPlaying={player.status === PLAYER.PLAYING}
        onNext={next}
        onPlay={handlePlay}
        onPause={handlePause}
        onStop={handleStop}
        onVolumeUp={() => setVolume(volume >= 100 ? volume : volume + 10)}
        onVolumeDown={() => setVolume(volume <= 0 ? volume : volume - 10)}
        period={wait}
        onPeriodChange={handlePeriodChange}
      />
      {hasTrack && (
        <>
          <Sound
            url={buildUrl(dir, track)}
            playStatus={player.status}
            playFromPosition={player.pos}
            volume={volume}
            onFinishedPlaying={handleFinish}
          />
          <div title={track} className={`${styles.centred} ${styles.player}`}>
            {`Track ${trackTitle} is ${trackStatus}`}
          </div>
        </>
      )}
    </div>
  );
});
