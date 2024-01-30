import React from 'react';

const pendingCalls: (() => void)[] = [];
let initialized = false;

let soundManager: soundmanager.SoundManager;
// Allow server side rendering
if (typeof window !== 'undefined') {
  ({ soundManager } = require('soundmanager2'));

  soundManager.setup({
    debugMode: false,
    useHTML5Audio: true,
  });

  soundManager.onready &&
    // @ts-ignore
    soundManager.onready(() => {
      pendingCalls.slice().forEach((cb) => cb());
    });
}

function createSound(options: any, cb: (sound: soundmanager.SMSound) => void) {
  if (soundManager.ok()) {
    cb(soundManager.createSound(options));
    return () => {};
  } else {
    if (!initialized) {
      initialized = true;
      // @ts-ignore
      soundManager.beginDelayedInit();
    }

    const call = () => {
      cb(soundManager.createSound(options));
    };

    pendingCalls.push(call);

    return () => {
      pendingCalls.splice(pendingCalls.indexOf(call), 1);
    };
  }
}

function noop() {}

const playStatuses = {
  PLAYING: 'PLAYING',
  STOPPED: 'STOPPED',
  PAUSED: 'PAUSED',
};

type Props = {
  url: string;
  playStatus: 'PLAYING' | 'STOPPED' | 'PAUSED';
  position?: number;
  playFromPosition?: number;
  volume: number;
  playbackRate: number;
  onError: (err: number, description: string, self: Sound) => void;
  onLoading: (self: Sound) => void;
  onLoad: (self: Sound) => void;
  onPlaying: (self: Sound) => void;
  onPause: (self: Sound) => void;
  onResume: (self: Sound) => void;
  onStop: (self: Sound) => void;
  onFinishedPlaying: () => void;
  onBufferChange: (isBuffering: boolean) => void;
  autoLoad: boolean;
  loop: boolean;
};

export default class Sound extends React.Component<Props> {
  static status = playStatuses;

  static defaultProps = {
    volume: 100,
    playbackRate: 1,
    onError: noop,
    onLoading: noop,
    onPlaying: noop,
    onLoad: noop,
    onPause: noop,
    onResume: noop,
    onStop: noop,
    onFinishedPlaying: noop,
    onBufferChange: noop,
    autoLoad: false,
    loop: false,
  };

  private sound: soundmanager.SMSound | undefined;
  private stopCreatingSound: (() => void) | undefined;

  componentDidMount() {
    this.createSound((sound: soundmanager.SMSound) => this.updateSound(sound));
  }

  componentWillUnmount() {
    this.removeSound();
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.url !== prevProps.url) {
      this.createSound((sound: soundmanager.SMSound) =>
        this.updateSound(sound, prevProps),
      );
    } else {
      this.updateSound(this.sound, prevProps);
    }
  }

  updateSound(sound?: soundmanager.SMSound, prevProps?: Props) {
    if (!sound) {
      return;
    }

    if (this.props.playStatus === playStatuses.PLAYING) {
      if (sound.playState === 0) {
        sound.play();
      }

      if (sound.paused) {
        sound.resume();
      }
    } else if (this.props.playStatus === playStatuses.STOPPED) {
      if (sound.playState !== 0) {
        sound.stop();
      }
    } else {
      // this.props.playStatus === playStatuses.PAUSED
      if (!sound.paused) {
        sound.pause();
      }
    }

    if (this.props.playFromPosition != null) {
      if (this.props.playFromPosition !== prevProps?.playFromPosition) {
        sound.setPosition(this.props.playFromPosition);
      }
    }

    if (this.props.position != null) {
      if (
        sound.position !== this.props.position &&
        Math.round(sound.position) !== Math.round(this.props.position)
      ) {
        sound.setPosition(this.props.position);
      }
    }

    if (this.props.volume !== prevProps?.volume) {
      sound.setVolume(this.props.volume);
    }

    if (this.props.playbackRate !== prevProps?.playbackRate) {
      // @ts-ignore
      sound.setPlaybackRate(this.props.playbackRate);
    }
  }

  createSound(callback: (sound: soundmanager.SMSound) => void) {
    this.removeSound();

    const instance = this;

    if (!this.props.url) {
      return;
    }

    this.stopCreatingSound = createSound(
      {
        url: this.props.url,
        autoLoad: this.props.autoLoad,
        volume: this.props.volume,
        position: this.props.playFromPosition || this.props.position || 0,
        playbackRate: this.props.playbackRate,
        whileloading() {
          instance.props.onLoading(this);
        },
        whileplaying() {
          instance.props.onPlaying(this);
        },
        onerror(errorCode: number, description: string) {
          instance.props.onError(errorCode, description, this);
        },
        onload() {
          instance.props.onLoad(this);
        },
        onpause() {
          instance.props.onPause(this);
        },
        onresume() {
          instance.props.onResume(this);
        },
        onstop() {
          instance.props.onStop(this);
        },
        onfinish() {
          if (
            instance.props.loop &&
            instance.props.playStatus === playStatuses.PLAYING
          ) {
            instance.sound?.play();
          } else {
            instance.props.onFinishedPlaying();
          }
        },
        onbufferchange() {
          instance.props.onBufferChange(this.isBuffering);
        },
      },
      (sound: soundmanager.SMSound) => {
        this.sound = sound;
        callback(sound);
      },
    );
  }

  removeSound() {
    if (this.stopCreatingSound) {
      this.stopCreatingSound();
      delete this.stopCreatingSound;
    }

    if (this.sound) {
      try {
        this.sound.destruct();
      } catch (e) {} // eslint-disable-line

      delete this.sound;
    }
  }

  render() {
    return null;
  }
}
