import moment from 'moment';

/**
 * The class for date manipulations.
 *
 * @since 0.1.0
 */
export default class _date {
  /**
   * Extracts the amount of minutes since the beginning of the day of the date.
   *
   * @param {Date} date The date for duration extraction.
   * @returns {Number} The total amount of minutes.
   */
  static toMinutes(date) {
    return moment.duration(`${date.getHours()}:${date.getMinutes()}`).asMinutes();
  }

  /**
   * Adds given value of minutes to a date.
   *
   * @param {Number} minutes The number of minutes to add.
   */
  static toDate(minutes) {
    return moment('1945-05-09').add(minutes, 'minutes').toDate();
  }
}
