import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Menu, MenuItem } from '@blueprintjs/core';
import onClickOutside from 'react-onclickoutside';

import styles from './EventMenu.css';

class EventMenu extends Component {
  static propTypes = {
    onEventTickets: PropTypes.func,
    onEventCreate: PropTypes.func
  }

  static defaultProps = {
    onEventTickets: () => { },
    onEventCreate: () => { }
  }

  state = {
    isOpen: false,
    x: 0,
    y: 0,
    type: 'day',
    data: {}
  }

  show = (event, data_, type_) => {
    this.setState({ isOpen: true, x: event.pageX, y: event.pageY, type: type_, data: data_ });
  }

  close = () => {
    this.setState({ isOpen: false });
  }

  handleClick = () => {
    const { type, data } = this.state;

    if (type === 'day') {
      this.props.onEventCreate(data.format());
    } else if (type === 'event') {
      this.props.onEventCreate(data.start);
    }
  }

  handleEventClick = () => {
    // Just for close
    this.handleClickOutside();
    this.props.onEventTickets(this.state.data.id);
  }

  handleClickOutside = () => {
    this.setState({ isOpen: false });
  }

  render() {
    const style = {
      left: this.state.x,
      top: this.state.y
    };

    return (
      <div className={`${styles.menu} ${this.state.isOpen ? styles.active : styles.hidden}`} style={style}>
        <div className={`pt-icon-standard pt-icon-chevron-left ${styles.mark}`} />
        <Menu>
          <MenuItem iconName="add" onClick={this.handleClick} text="New event" />
          {this.state.type === 'event' &&
            <MenuItem iconName="dollar" onClick={this.handleEventClick} text="Sell tickets" />
          }
        </Menu>
      </div>
    );
  }
}

export default onClickOutside(EventMenu);
