import moment from 'moment';

/**
 * The class for date manipulations.
 *
 * @since 0.1.0
 */
export default class _date {
  // Returns the number of minutes passed since 00:00 of the date.
  static toMinutes = (date: Date = new Date()): number =>
    moment.duration(`${date.getHours()}:${date.getMinutes()}`).asMinutes();

  // Returns the number of seconds passed since 00:00 of the date.
  static toSeconds = (date: Date = new Date()): number =>
    moment
      .duration(`${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`)
      .asSeconds();

  // Adds given value of minutes to a date.
  static toDate = (minutes: number): Date =>
    moment('1945-05-09').add(minutes, 'minutes').toDate();

  // Converts the number of minutes into the hh:mm formatted string.
  static minutesToHm(minutes: number): string {
    if (minutes < 1) {
      return '00:00';
    }

    const h = Math.trunc(minutes / 60);
    const m = minutes % 60;

    return `${h < 10 ? `0${h}` : h}:${m < 10 ? `0${m}` : m}`;
  }

  // Converts a formatted string into date object.
  static fromYmd = (value: string): Date =>
    moment(value, 'YYYY-MM-DD').toDate();

  // Converts the date into YYYY-MM-DD format.
  static toYmd = (date: Date): string => moment(date).format('YYYY-MM-DD');

  // Re-formats a date string with the provided format.
  static format = (date: string, format: string): string =>
    moment(date).format(format);

  // Returns the current date.
  static current = (): string => moment().format('YYYY-MM-DD');

  static startOfMonth = (): string =>
    moment().startOf('month').format('YYYY-MM-DD');
  static endOfMonth = (): string =>
    moment().endOf('month').format('YYYY-MM-DD');

  // Returns two dates in the array as [-3 days, +3 days] counting from the current date.
  static getThreeDaysRange = (): [Date, Date] => [
    moment().subtract(3, 'days').toDate(),
    moment().add(3, 'days').toDate(),
  ];
}
