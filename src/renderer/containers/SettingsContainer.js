import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, EditableText } from '@blueprintjs/core';

import { Api } from 'cosmoport-core-api-client';
import DefaultLocaleMessage from '../components/locale/DefaultLocaleMessage';
import EventTypeAddDialog from '../components/dialog/EventTypeAddDialog';
import EventTypeDelDialog from '../components/dialog/EventTypeDelDialog';
import Message from '../components/messages/Message';
import LocaleInput from '../components/locale/LocaleInput';
import LocaleMapper from '../components/mapper/LocaleMapper';
import TextValueEditor from '../components/editor/TextValueEditor';
import BusinessHoursEditor from '../components/editor/bs/BusinessHoursEditor';

import styles from '../components/settings/Settings.module.css';
import EventType from '../components/eventType/EventType';

const mapEvent = (data) => ({
  category_id: data.category_id,
  default_duration: data.default_duration,
  default_repeat_interval: data.default_repeat_interval,
  default_cost: data.default_cost,
  description: data.description,
  name: data.name,
  subtypes: data.subtypes,
});

function Caption(props) {
  return <p className={styles.caption}>{props.text}</p>;
}

Caption.propTypes = { text: PropTypes.string.isRequired };
const updateLocale = (locale, locales) =>
  locales.map((l) => (l.id === locale.id ? locale : l));

export default class SettingsContainer extends Component {
  static propTypes = {
    api: PropTypes.instanceOf(Api).isRequired,
    onRefresh: PropTypes.func,
  };

  static defaultProps = {
    onRefresh: () => {},
  };

  constructor(props) {
    super(props);

    this.state = {
      hasData: false,
      refs: {},
      locales: [],
      trans: {},
      settings: [],

      eventTypeAddDialogIsOpen: false,
    };
  }

  UNSAFE_componentWillMount() {
    this.getData();
  }

  getData = () => {
    Promise.all([
      this.props.api.fetchReferenceData(),
      this.props.api.fetchLocales(),
      this.props.api.fetchTranslations(),
      this.props.api.fetchSettings(),
    ]).then((data) =>
      this.setState({
        hasData: true,
        refs: data[0],
        locales: data[1],
        trans: data[2].en,
        settings: data[3],
      }),
    );
  };

  onEventTypeAddDialogToggle = () =>
    this.setState({
      eventTypeAddDialogIsOpen: !this.state.eventTypeAddDialogIsOpen,
    });

  handleCreateEventType = () => {
    this.onEventTypeAddDialogToggle();
  };

  handleDeleteEventType = () => {
    this.eventTypeDelDialog.toggleDialog();
  };

  handleCreate = (formData, callback) => {
    if (!formData.valid) {
      Message.show('Please check the form data.', 'error');
      return;
    }

    this.props.api.createEventType(mapEvent(formData)).then((result) => {
      const id = result.eventTypes[0].id;
      Message.show(`Event type has been created [${id}].`);
      this.getData();
      callback();

      return 1;
    });
  };

  handleNewCategory = (name) => {
    if (name === '') return;

    this.props.api.createEventTypeCategory({ name: name }).then((result) => {
      Message.show(`Event type category has been created [${result.id}].`);
      this.getData();
    });
  };

  handleDelete = (id, callback) => {
    this.props.api.deleteEventType(id).then((result) => {
      Message.show(`Event type has been deleted [:${result.deleted}]`);
      this.getData();
      callback();
      return 1;
    });
  };

  handleLocaleTimeoutChange = (locale, value) => {
    const updated = { ...LocaleMapper.map(locale), show_time: value };

    this.props.api
      .updateLocaleShowData(updated)
      .then((result) => Message.show(`Locale has been updated [${result.id}].`))
      .then(() => {
        this.setState({
          locales: updateLocale(
            LocaleMapper.unmap(updated),
            this.state.locales,
          ),
        });
      });
  };

  handleCheck = (locale, value) => {
    const updated = { ...LocaleMapper.map(locale), show: value };

    this.props.api
      .updateLocaleShowData(updated)
      .then((result) => Message.show(`Locale has been updated [${result.id}].`))
      .then(() => {
        this.setState({
          locales: updateLocale(
            LocaleMapper.unmap(updated),
            this.state.locales,
          ),
        });
      });
  };

  findSetting = (settings, key) =>
    settings.find((setting) => setting.param === key) || { id: 0, value: '' };

  handleSettingConfirm = (id, newVal, oldVal) => {
    if (newVal === oldVal) {
      return;
    }

    const valueObject = { text: newVal };

    this.props.api
      .updateSettingValueForId(id, valueObject)
      .then(() => Message.show('The value has been saved successfully.'))
      .then(() => this.handleRefresh());
  };

  handlePassChange = () => {
    const pass = this.passField.value;

    this.props.api
      .authSetPass({ pwd: pass })
      .then((response) =>
        response.result
          ? Message.show('Password has changed.')
          : Message.show('Error during save.', 'error'),
      );
  };

  handleRefresh = () => {
    this.getData();
    this.props.onRefresh();
  };

  handleBs = (id, text_) => {
    const valueObject = { text: text_ };

    this.props.api
      .updateSettingValueForId(id, valueObject)
      .then(() => Message.show('The value has been saved successfully.'))
      .then(() => this.handleRefresh());
  };

  render() {
    const {
      hasData,
      locales,
      refs,
      settings,
      trans,
      eventTypeAddDialogIsOpen,
    } = this.state;

    if (!hasData) {
      return null;
    }

    const localeMessage = DefaultLocaleMessage(locales);
    const localeTimeouts = locales.map((locale) => (
      <LocaleInput
        key={locale.id}
        locale={locale}
        onChange={this.handleLocaleTimeoutChange}
        onCheck={this.handleCheck}
      />
    ));
    const linesSetting = this.findSetting(settings, 'timetable_screen_lines');
    const boardingSetting = this.findSetting(settings, 'boarding_time');
    const syncAddrSetting = this.findSetting(settings, 'sync_server_address');
    const businessHoursSetting = this.findSetting(settings, 'business_hours');

    const et = EventType({
      categories: refs.type_categories,
      translation: trans,
    });

    return (
      <>
        <EventTypeAddDialog
          categories={refs.type_categories}
          etDisplay={et}
          isOpen={eventTypeAddDialogIsOpen}
          toggle={this.onEventTypeAddDialogToggle}
          callback={this.handleCreate}
          categoryCreateCallback={this.handleNewCategory}
        />
        <EventTypeDelDialog
          etDisplay={et}
          types={refs.types}
          ref={(c) => {
            this.eventTypeDelDialog = c;
          }}
          callback={this.handleDelete}
        />

        <div className="bp5-callout" style={{ fontSize: '80%' }}>
          All of thees changes are applied in real time. So no need to restart
          any of the applications.
        </div>

        <div className={styles.container}>
          <Caption text="00 Simulation" />
          <div>
            <div>
              Before each depart event there is a boarding interval and before
              each return — display interval of
              <TextValueEditor
                className={styles.edit}
                id={boardingSetting.id}
                text={boardingSetting.value}
                onConfirm={this.handleSettingConfirm}
                placeholder=""
                selectAllOnFocus
              />
              minutes to show an information.
            </div>
            <div style={{ fontSize: '85%' }}>
              Fill free to decrease this value but it is not recommended to
              increase it because some of the intervals might overlap each
              other.
            </div>
            <p />
            <div>
              <p>
                Here you can set the business hours when simulation will be
                working.
              </p>
              <BusinessHoursEditor
                setting={businessHoursSetting}
                onSet={this.handleBs}
              />
            </div>
          </div>

          <Caption text="01 Events" />
          <div>
            <Button
              className="bp5-minimal"
              text="Click if you want to create new event type"
              onClick={this.handleCreateEventType}
            />
            <Button
              className="bp5-minimal"
              text="Click if you want to delete an event type"
              onClick={this.handleDeleteEventType}
            />
          </div>

          <Caption text="02 Locales" />
          <div>
            {localeMessage}
            <div>
              Every other app will be being shown given amount of time in all of
              the selected translations:
            </div>
            <div className={styles.margin}>{localeTimeouts}</div>
            <div>
              You can create new translations in the dedicated translation
              interface of the application (
              <span className="bp5-icon-translate" />
              ).
            </div>
          </div>

          <Caption text="03 Timetable" />
          <div>
            For each of 3 screens of the Timetable app it will be showing just
            <TextValueEditor
              className={styles.edit}
              id={linesSetting.id}
              text={linesSetting.value}
              onConfirm={this.handleSettingConfirm}
              placeholder=""
              selectAllOnFocus
            />
            lines of events.
          </div>

          <Caption text="04 Protection" />
          <div>
            <span>Change the password:</span>
            <div className="bp5-control-group" style={{ marginTop: '.6em' }}>
              <input
                type="password"
                className="bp5-input"
                placeholder="Be brave."
                ref={(c) => {
                  this.passField = c;
                }}
              />
              <button
                className="bp5-button bp5-icon-floppy-disk"
                onClick={this.handlePassChange}
              />
            </div>
          </div>

          <Caption text="05 Synchronization" />
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
}
