import Sound from 'react-sound';
import { AnnouncementType } from '../../types/Types';

type Announcer = {
  audio?: { path: string };
  announcements: Partial<AnnouncementType>[];
  status: PlayStatusType;
  onAnnouncementEnd: () => void;
};

export type PlayStatusType = 'PLAYING' | 'STOPPED' | 'PAUSED';

const buildUrl = (path: string, track: string) =>
  `media:///${path}/events/${track}`;

export default function Announcer({
  audio = { path: '' },
  announcements = [],
  status = 'PLAYING',
  onAnnouncementEnd = () => {},
}: Announcer) {
  if (announcements.length === 0) return null;

  return (
    <Sound
      url={buildUrl(audio.path, `${announcements[0].type}.mp3`)}
      playStatus={status}
      playFromPosition={0}
      volume={30}
      onFinishedPlaying={onAnnouncementEnd}
    />
  );
}
