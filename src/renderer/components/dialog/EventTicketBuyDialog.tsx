import { useState } from 'react';

import { Button, Switch } from '@blueprintjs/core';

import L18n from '../../components/l18n/L18n';
import _date from '../../components/date/_date';
import { EventType } from '../../types/Types';
import { default as Et } from '../eventType/EventType';

import styles from './EventTicketBuyDialog.module.css';
import { BaseDialog, BaseDialogCallback, BaseDialogProps } from './BaseDialog';

type Props = {
  event?: EventType;
  et?: ReturnType<typeof Et>;
  l18n?: L18n;
} & BaseDialogProps &
  BaseDialogCallback<(id: number, tickets: number, force: boolean) => void>;

export default function EventTicketBuyDialog({
  event,
  et,
  isOpen,
  l18n,
  callback = () => {},
  onClose = () => {},
}: Props) {
  if (!event) return null;

  const [tickets, setTickets] = useState(event.contestants);
  const [forceReopen, setForceReopen] = useState(false);

  const passState = () => {
    if (tickets !== event.contestants) {
      callback(event.id, tickets, forceReopen);
    }
  };

  const renderEventInfo = (
    event: EventType,
    l18n?: L18n,
    et?: ReturnType<typeof Et>,
  ) => {
    if (!event || !l18n || !et) return null;

    const typeRef = l18n.findEventRefByEventTypeId(event.eventTypeId);
    const stateRef = l18n.findEventRefByEventStateId(event.eventStateId);
    const statusRef = l18n.findEventRefByEventStatusId(event.eventStatusId);

    return (
      <div className={styles.eventInfo}>
        <div className={styles.eventTitle}>{et.getFullName(typeRef)}</div>
        <div className={styles.eventProperty}>
          <span>Date</span>
          <span>{_date.format(event.eventDate, 'D MMMM YYYY')}</span>
        </div>
        <div className={styles.eventProperty}>
          <span>Time</span>
          <span>{`${_date.minutesToHm(event.startTime)} - ${_date.minutesToHm(
            event.startTime + event.durationTime,
          )}`}</span>
        </div>
        <div className={styles.eventProperty}>
          <span>State</span>
          <span>{`${l18n.findTranslationById(
            stateRef,
            'i18nState',
          )} / ${l18n.findTranslationById(statusRef, 'i18nStatus')}`}</span>
        </div>
        <div className={styles.eventProperty}>
          <span>Gates</span>
          <span>{`${event.gateId} → ${event.gate2Id}`}</span>
        </div>
        <div className={styles.eventTickets}>
          The number of tickets have been sold {renderTicketValue()} of{' '}
          {event.peopleLimit} so far.
        </div>
      </div>
    );
  };

  const renderTicketValue = () => {
    const elements = [];

    if (tickets !== event.contestants) {
      elements.push(
        <span key={0} className={styles.strike}>
          {event.contestants}
        </span>,
      );
    }
    elements.push(
      <span key={1} className={styles.tickets}>
        {tickets}
      </span>,
    );

    return elements;
  };

  const inc = () => {
    setTickets((t) => (t + 1 <= event.peopleLimit ? t + 1 : t));
  };

  const dec = () => {
    setTickets((t) => (t - 1 >= 0 ? t - 1 : t));
  };

  const handleReopenChange = () => {
    setForceReopen((r) => !r);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <BaseDialog
      isOpen={isOpen}
      onClose={onClose}
      title="Sell tickets"
      actions={
        <>
          <Switch
            className={styles.switch}
            checked={forceReopen}
            labelElement={<strong>Reopen</strong>}
            onChange={handleReopenChange}
          />
          <Button onClick={inc} icon={'plus'} />
          <Button onClick={dec} icon={'minus'} />
          <Button onClick={passState} text="Save" />
        </>
      }
    >
      <div className={styles.notice}>
        Here you can update tickets selling information.
      </div>
      {renderEventInfo(event, l18n, et)}
    </BaseDialog>
  );
}
