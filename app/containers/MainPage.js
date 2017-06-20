import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Calendar from '../components/calendar/Calendar';
import Api from '../../lib/core-api-client/ApiV1';
import ApiError from '../components/indicators/ApiError';
import PageCaption from '../components/page/PageCaption';

export default class MainPage extends Component {
  static propTypes = {
    api: PropTypes.instanceOf(Api).isRequired
  }

  constructor(props) {
    super(props);

    this.state = { isItOpen: false, events: [], locale: {}, refs: {} };
  }

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    Promise.all([
      this.props.api.fetchReferenceData(),
      this.props.api.fetchTranslations(),
      this.props.api.fetchEvents()
    ]).then(data => this.setState({ refs: data[0], locale: data[1].en, events: data[2] }))
      .catch(error => ApiError(error));
  }

  render() {
    const { events, locale, refs } = this.state;

    return (
      <div>
        <PageCaption text="01 Calendar (WIP)" />
        <Calendar events={events} locale={locale} refs={refs} />
        <p />
      </div>
    );
  }
}
