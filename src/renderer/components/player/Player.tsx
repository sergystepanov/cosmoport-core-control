import { useCallback, useState, useEffect, memo } from 'react';
import Sound from '../../components/sound/Sound';

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
  });

  let t: ReturnType<typeof setTimeout>;

  const next = () => setTrackNo((t) => (t + 1) % (files.length - 1));

  useEffect(() => {
    shuffle(files);
    setPlaylist(files);
    next();
    return () => {
      setPlayer({ status: PLAYER.STOPPED, isWait: false });
      clearTimeout(t);
    };
  }, [dir, files]);

  useEffect(() => {
    if (!player.isWait) return;

    next();
    t = setTimeout(
      () => {
        setPlayer({ status: PLAYER.PLAYING, isWait: false });
      },
      wait * 1000 * 60,
    );
  }, [player]);

  const handlePeriodChange = useCallback(
    (minutes: number) => setWait(minutes),
    [],
  );

  const onFinishPlay = useCallback(() => {
    setPlayer({ ...player, status: PLAYER.STOPPED, isWait: true });
  }, []);

  const handleEvent = useCallback((op: string) => {
    switch (op) {
      case 'next':
        next();
        break;
      case 'finish':
        onFinishPlay();
        break;
      case 'pause':
        clearTimeout(t);
        setPlayer({ ...player, status: PLAYER.PAUSED, isWait: false });
        break;
      case 'play':
        setPlayer({ ...player, status: PLAYER.PLAYING, isWait: false });
        break;
      case 'stop':
        clearTimeout(t);
        setPlayer({ status: PLAYER.STOPPED, isWait: false });
        break;
      case 'vol+':
        setVolume((vol) => (vol >= 100 ? vol : vol + 10));
        break;
      case 'vol-':
        setVolume((vol) => (vol <= 0 ? vol : vol - 10));
        break;
    }
  }, []);

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
        onEvent={handleEvent}
        period={wait}
        onPeriodChange={handlePeriodChange}
      />
      {hasTrack && (
        <>
          <Sound
            url={buildUrl(dir, track)}
            playStatus={player.status}
            volume={volume}
            onFinishedPlaying={onFinishPlay}
          />
          <div title={track} className={`${styles.centred} ${styles.player}`}>
            {`Track ${trackTitle} is ${trackStatus}`}
          </div>
        </>
      )}
    </div>
  );
});
