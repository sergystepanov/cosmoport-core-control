// @flow
import React, {Component} from 'react';
import $ from 'jquery';

require('fullcalendar/dist/fullcalendar.min.js');

export default class Calendar extends Component {
  componentDidMount() {
    this.$node = $(this.refs.calendar);

    this
      .$node
      .fullCalendar({});
  }

  componentWillUnmount() {
    // Clean up the mess when the component unmounts this.$node.sortable('destroy');
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillReceiveProps(nextProps) {
    // Each time when component receives new props, we should trigger refresh or
    // perform anything else we need. For this example, we'll update only the
    // enable/disable option, as soon as we receive a different value for
    // this.props.enable if (nextProps.enable !== this.props.enable) {
    // this.$node.sortable(nextProps.enable ? 'enable' : 'disable'); }
  }

  render() {
    return (<div ref="calendar"/>);
  }
}
