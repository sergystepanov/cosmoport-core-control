import { useEffect, useState } from 'react';

import {
  Button,
  Callout,
  EditableText,
  Icon,
  InputGroup,
} from '@blueprintjs/core';

import { Api } from 'cosmoport-core-api-client';
import DefaultLocaleMessage from '../components/locale/DefaultLocaleMessage';
import EventTypeAddDialog from '../components/dialog/EventTypeAddDialog';
import EventTypeDelDialog from '../components/dialog/EventTypeDelDialog';
import Message from '../components/messages/Message';
import LocaleInput from '../components/locale/LocaleInput';
import LocaleMapper from '../components/mapper/LocaleMapper';
import TextValueEditor from '../components/editor/TextValueEditor';
import BusinessHoursEditor from '../components/editor/bs/BusinessHoursEditor';
import EventType from '../components/eventType/EventType';
import SectionTitle from '../components/settings/SectionTitle';

import styles from '../components/settings/Settings.module.css';
import {
  LocaleDescriptionType,
  LocaleType,
  RefsType,
  SettingType,
} from '../types/Types';
import { DialogState } from '../components/dialog/BaseDialog';

type Props = {
  api: Api;
  onRefresh: () => void;
};

type State = {
  hasData?: boolean;
  locales: LocaleDescriptionType[];
  refs: RefsType;
  settings: SettingType[];
  trans: LocaleType;
  eventTypeAddDialogState?: DialogState;
};

// !to remove this
const mapEvent = (data: any) => ({
  category_id: data.category_id,
  default_duration: data.default_duration,
  default_repeat_interval: data.default_repeat_interval,
  default_cost: data.default_cost,
  description: data.description,
  name: data.name,
  subtypes: data.subtypes,
});

const updateLocale = (
  locale: LocaleDescriptionType,
  locales: LocaleDescriptionType[],
): LocaleDescriptionType[] =>
  locales.map((l) => (l.id === locale.id ? locale : l));

export default function SettingsContainer({ api, onRefresh }: Props) {
  const [state, setState] = useState<State>({
    hasData: false,
    refs: {
      destinations: [],
      statuses: [],
      states: [],
      types: [],
      type_categories: [],
    },
    locales: [],
    trans: {},
    settings: [],
  });

  const [pass, setPass] = useState('');

  const [eventTypeDelDialogState, setEventTypeDelDialogState] = useState(
    DialogState.CLOSE,
  );

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    Promise.all([
      api.fetchReferenceData(),
      api.fetchLocales(),
      api.fetchTranslations(),
      api.fetchSettings(),
    ]).then((data) =>
      setState({
        ...state,
        hasData: true,
        refs: data[0],
        locales: data[1],
        trans: data[2].en,
        settings: data[3],
      }),
    );
  };

  const onEventTypeAddDialogToggle = () =>
    setState({
      ...state,
      eventTypeAddDialogState:
        state.eventTypeAddDialogState === DialogState.ADD
          ? DialogState.CLOSE
          : DialogState.ADD,
    });

  const handleCreateEventType = () => {
    onEventTypeAddDialogToggle();
  };

  const toggleEventTypeDelDialog = () =>
    setEventTypeDelDialogState((s) =>
      s === DialogState.CLOSE ? DialogState.EDIT : DialogState.CLOSE,
    );

  const handleDeleteEventType = () => toggleEventTypeDelDialog();

  const handleCreate = (formData: any, callback: () => void) => {
    if (!formData.valid) {
      Message.show('Please check the form data.', 'error');
      return;
    }

    api
      .createEventType(mapEvent(formData))
      .then((result) => {
        const id = result.eventTypes[0].id;
        Message.show(`Event type has been created [${id}].`);
        getData();
        callback();
        return 1;
      })
      .catch(console.error);
  };

  const handleNewCategory = (name: string) => {
    name !== '' &&
      api
        .createEventTypeCategory({ name: name })
        .then((result) => {
          Message.show(`Event type category has been created [${result.id}].`);
          getData();
        })
        .catch(console.error);
  };

  const handleDelete = (id: string, callback: () => void) => {
    api
      .deleteEventType(id)
      .then((result) => {
        Message.show(`Event type has been deleted [:${result.deleted}]`);
        getData();
        callback();
        return 1;
      })
      .catch(console.error);
  };

  const handleLocaleTimeoutChange = (
    locale: LocaleDescriptionType,
    value: number,
  ) => {
    const updated = { ...LocaleMapper.map(locale), show_time: value };

    api
      .updateLocaleShowData(updated)
      .then((result) => Message.show(`Locale has been updated [${result.id}].`))
      .then(() => {
        setState({
          ...state,
          locales: updateLocale(LocaleMapper.unmap(updated), state.locales),
        });
      })
      .catch(console.error);
  };

  const handleCheck = (locale: LocaleDescriptionType, value: boolean) => {
    const updated = { ...LocaleMapper.map(locale), show: value };

    api
      .updateLocaleShowData(updated)
      .then((result) => Message.show(`Locale has been updated [${result.id}].`))
      .then(() => {
        setState({
          ...state,
          locales: updateLocale(LocaleMapper.unmap(updated), state.locales),
        });
      })
      .catch(console.error);
  };

  const findSetting = (settings: SettingType[], key: string) =>
    settings.find((setting) => setting.param === key) || { id: 0, value: '' };

  const handleSettingConfirm = (id: number, newVal: string, oldVal: string) => {
    if (newVal === oldVal) {
      return;
    }

    api
      .updateSettingValueForId(id, { text: newVal })
      .then(() => Message.show('The value has been saved successfully.'))
      .then(() => handleRefresh())
      .catch(console.error);
  };

  const handlePasswordChange = (value: string) => {
    setPass(value);
  };

  const handlePassSave = () => {
    if (pass === '') return;

    api
      .authSetPass({ pwd: pass })
      .then((response) =>
        response.result
          ? Message.show('Password has changed.')
          : Message.show('Error during save.', 'error'),
      )
      .catch(console.error);
  };

  const handleRefresh = () => {
    getData();
    onRefresh();
  };

  const handleBs = (id: number, text_: string) => {
    api
      .updateSettingValueForId(id, { text: text_ })
      .then(() => Message.show('The value has been saved successfully.'))
      .then(() => handleRefresh())
      .catch(console.error);
  };

  const { hasData, locales, refs, settings, trans, eventTypeAddDialogState } =
    state;

  if (!hasData) {
    return null;
  }

  const localeMessage = DefaultLocaleMessage(locales);
  const localeTimeouts = locales.map((locale) => (
    <LocaleInput
      key={locale.id}
      locale={locale}
      onChange={handleLocaleTimeoutChange}
      onCheck={handleCheck}
    />
  ));
  const linesSetting = findSetting(settings, 'timetable_screen_lines');
  const boardingSetting = findSetting(settings, 'boarding_time');
  const syncAddrSetting = findSetting(settings, 'sync_server_address');
  const businessHoursSetting = findSetting(settings, 'business_hours');

  const et = EventType({
    categories: refs.type_categories,
    translation: trans,
  });

  return (
    <>
      <EventTypeAddDialog
        categories={refs.type_categories}
        et={et}
        state={eventTypeAddDialogState}
        toggle={onEventTypeAddDialogToggle}
        callback={handleCreate}
        categoryCreateCallback={handleNewCategory}
      />
      <EventTypeDelDialog
        state={eventTypeDelDialogState}
        et={et}
        types={refs.types}
        callback={handleDelete}
        onClose={toggleEventTypeDelDialog}
        onSuccess={toggleEventTypeDelDialog}
      />

      <Callout
        children={
          <span style={{ fontSize: '80%' }}>
            All of thees changes are applied in real time. So no need to restart
            any of the applications.
          </span>
        }
      />

      <div className={styles.container}>
        <SectionTitle text="00 Simulation" />
        <div>
          <div>
            Before each depart event there is a boarding interval and before
            each return — display interval of
            <TextValueEditor
              className={styles.edit}
              id={boardingSetting.id}
              text={boardingSetting.value}
              onConfirm={handleSettingConfirm}
            />
            minutes to show an information.
          </div>
          <div style={{ fontSize: '85%' }}>
            Fill free to decrease this value but it is not recommended to
            increase it because some of the intervals might overlap each other.
          </div>
          <p />
          <div>
            <p>
              Here you can set the business hours when simulation will be
              working.
            </p>
            <BusinessHoursEditor
              setting={businessHoursSetting}
              onSet={handleBs}
            />
          </div>
        </div>

        <SectionTitle text="01 Events" />
        <div>
          <Button
            minimal
            text="Click if you want to create new event type"
            onClick={handleCreateEventType}
          />
          <Button
            minimal
            text="Click if you want to delete an event type"
            onClick={handleDeleteEventType}
          />
        </div>

        <SectionTitle text="02 Locales" />
        <div>
          {localeMessage}
          <div>
            Every other app will be being shown given amount of time in all of
            the selected translations:
          </div>
          <div className={styles.margin}>{localeTimeouts}</div>
          <div>
            You can create new translations in the dedicated translation
            interface of the application (<Icon icon="translate" />
            ).
          </div>
        </div>

        <SectionTitle text="03 Timetable" />
        <div>
          For each of 3 screens of the Timetable app it will be showing just
          <TextValueEditor
            className={styles.edit}
            id={linesSetting.id}
            text={linesSetting.value}
            onConfirm={handleSettingConfirm}
          />
          lines of events.
        </div>

        <SectionTitle text="04 Protection" />
        <div style={{ width: '200px' }}>
          <span>Change the password:</span>
          <InputGroup
            type="password"
            placeholder="Be brave."
            onValueChange={handlePasswordChange}
            rightElement={
              <Button icon="floppy-disk" onClick={handlePassSave} />
            }
          ></InputGroup>
        </div>

        <SectionTitle text="05 Synchronization" />
        <div style={{ marginBottom: '1em' }}>
          All tickets data will be being synchronized with the server by the
          address:&nbsp;
          <EditableText
            className={styles.baseEdit}
            value={syncAddrSetting.value}
            placeholder=""
          />
          .
        </div>
        <p />
      </div>
    </>
  );
}
