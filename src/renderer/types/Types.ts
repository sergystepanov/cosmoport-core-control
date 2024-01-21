import { CosmoAction } from '../components/simulator/CosmoportSimulator';

/** Used for passing configuration from the main process (system) into renderer. */
export type AppResourcesType = {
  /** Contains audio track list information. */
  audio: {
    /** The dir relative to the app's home, where audio files are stored. */
    dir: string;
    /** A list of mp3 filenames relative to the audio dir. */
    mp3s: string[];
  };

  /** Contains key-value params parsed from the ini config files. Values are strings. */
  config: {
    /** Contains server address configuration. */
    address: {
      /** If the address has SSL protection ('true'). Needed for the https/wss protocol prefix generation.*/
      ssl?: string;
      /** Server address without the protocol. */
      server: string;
      /** Websocket address of the server without the protocol. */
      ws: string;
    };
  };
};

export type AnnouncementType = {
  id: number;
  time: number;
  type: string;
};

export type EventType = {
  id: number;
  contestants: number;
  cost: number;
  dateAdded: string;
  durationTime: number;
  eventDate: string;
  eventDestinationId: number;
  eventStateId: number;
  eventStatusId: number;
  eventTypeId: number;
  /** @param gateId - id number for the gate of departure */
  gateId: number;
  /** @param gate2Id - id number for the gate of return */
  gate2Id: number;
  peopleLimit: number;
  repeatInterval: number;
  startTime: number;
};

export type GateType = {
  id: number;
  number: number;
  gateName: string;
};

type i18nKeys = 'id' | 'i18nEventDestinationName' | 'i18nStatus' | 'i18nState';
export type EventI18nRecordType = {
  [K in i18nKeys]?: number;
};

export type EventDestinationType = {
  id: number;
  i18nEventDestinationName: number;
};

export type EventStatusType = {
  id: number;
  i18nStatus: number;
};

export type EventStateType = {
  id: number;
  i18nState: number;
};

export type EventTypeType = {
  id: number;
  categoryId: number;
  defaultCost: number;
  defaultDuration: number;
  defaultRepeatInterval: number;
  i18nEventTypeDescription: number;
  i18nEventTypeName: number;
};

export type EventTypeCategoryType = {
  id: number;
  parent: number;
  i18nEventTypeCategoryName: number;
};

export type EventFormDataType = {
  [key: string]: number | string | boolean;
};

export type LocaleType = {
  [index: number | string]: {
    id: number;
    values: string[];
  };
};

export type LocaleDescriptionType = {
  code: string;
  default?: boolean;
  id?: number;
  localeDescription: string;
  show?: boolean;
  showTime?: number;
};

export type I18nType = {
  id: number;
  tag: string;
  external: boolean;
  description: string;
  params: string;
};

export type TranslationType = {
  i18n: I18nType;
  id: number;
  localeId: number;
  text: string;
};

export type RefsType = {
  destinations: EventDestinationType[];
  statuses: EventStatusType[];
  states: EventStateType[];
  types: EventTypeType[];
  type_categories: EventTypeCategoryType[];
};

export type SimulationDataType = {
  active: boolean;
  ticks: number;
  actions: CosmoAction[];
  minutes: number;
};

export type BusinessHoursType = {
  start: number;
  end: number;
  non: boolean;
};

export type MusicListType = {
  music: {
    path: string;
    files: string[];
  };
};

export type SettingType = {
  id: number;
  param: string;
  value: string;
};
