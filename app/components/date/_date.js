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
   * @returns {Date} The date object.
   */
  static toDate(minutes) {
    return moment('1945-05-09').add(minutes, 'minutes').toDate();
  }

  /**
   * Converts the number of minutes into hh:mm format.
   *
   * @param {number} minutes The total number of minutes.
   * @returns {string} The formated string (hh:mm).
   */
  static minutesToHm(minutes) {
    if (minutes < 1) {
      return '00:00';
    }

    const h = Math.trunc(minutes / 60);
    const m = minutes % 60;

    return `${h < 10 ? `0${h}` : h}:${m < 10 ? `0${m}` : m}`;
  }

  /**
   * Converts a formated string into date object.
   *
   * @param {string} value The fromated date to convert.
   * @returns {Date} The date object.
   */
  static fromYmd(value) {
    return moment(value, 'YYYY-MM-DD').toDate();
  }

  /**
   * Converts the date into YYYY-MM-DD format.
   *
   * @param {Date} Date to convert.
   * @returns {string} The formated date string.
   */
  static toYmd(date) {
    return moment(date).format('YYYY-MM-DD');
  }
}
