import React, { PureComponent } from 'react';

import { Menu, MenuItem, MenuDivider } from '@blueprintjs/core';
import onClickOutside from 'react-onclickoutside';

import styles from './EventMenu.module.css';

type Props = {
  onEventTickets: (id: number) => void;
  onEventCreate: (date: string) => void;
};

type State = {
  isOpen: boolean;
  x: number;
  y: number;
  type: string;
  data: any;
};

class EventMenu extends PureComponent<Props, State> {
  state = {
    isOpen: false,
    x: 0,
    y: 0,
    type: 'day',
    data: {
      id: 0,
      start: {
        format: (f = '') => f,
      },
      title: '',
      format: () => '',
    },
  };

  show = (event: any, data_: any, type_: any) => {
    this.setState({
      isOpen: true,
      x: event?.pageX,
      y: event?.pageY,
      type: type_,
      data: data_,
    });
  };

  close = () => {
    this.setState({ isOpen: false });
  };

  handleClick = () => {
    const { onEventCreate } = this.props;
    const { type, data } = this.state;

    const value =
      type === 'day'
        ? data.format()
        : type === 'event'
        ? data.start.format()
        : '';

    onEventCreate(value);
  };

  handleEventClick = () => {
    // Just for close
    this.handleClickOutside();
    this.props.onEventTickets(this.state.data.id);
  };

  handleClickOutside = () => {
    this.setState({ isOpen: false });
  };

  render() {
    const style = {
      left: this.state.x,
      top: this.state.y,
    };

    const isEvent = this.state.type === 'event';

    return (
      <div
        className={`${styles.menu} ${
          this.state.isOpen ? styles.active : styles.hidden
        }`}
        style={style}
      >
        <div
          className={`bp5-icon-standard bp5-icon-chevron-left ${styles.mark}`}
        />
        <Menu>
          {isEvent && (
            <MenuDivider
              title={`${this.state.data.start.format('HH:mm')} ${
                this.state.data.title
              }`}
            />
          )}
          <MenuItem icon="add" onClick={this.handleClick} text="New event" />
          {isEvent && (
            <MenuItem
              icon="dollar"
              onClick={this.handleEventClick}
              text="Sell tickets"
            />
          )}
        </Menu>
      </div>
    );
  }
}

export default onClickOutside(EventMenu);
