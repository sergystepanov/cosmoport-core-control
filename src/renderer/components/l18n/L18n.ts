import { LocaleType, RefsType } from '../../types/Types';

export default class L18n {
  private readonly refs: RefsType | undefined;
  private readonly locale: LocaleType;

  constructor(locale: LocaleType, refs?: RefsType) {
    this.locale = locale;
    this.refs = refs;
  }

  findEventRefByEventTypeId(eventTypeId: number) {
    return this.findEventById(eventTypeId, 'types');
  }

  findEventRefByEventStatusId(eventStatusId: number) {
    return this.findEventById(eventStatusId, 'statuses');
  }

  findEventRefByEventStateId(eventStateId: number) {
    return this.findEventById(eventStateId, 'states');
  }

  findEventRefByEventDestinationId(eventDestinationId: number) {
    return this.findEventById(eventDestinationId, 'destinations');
  }

  findEventById = (id: number, property: string) =>
    // @ts-ignore
    this.refs[property].find((el: any) => el.id === id) || false;

  findTranslationById(ref: any, name: string) {
    if (ref === undefined || this.locale === undefined) return '';
    const data = this.locale[ref[name]];
    return ref && data ? data.values[0] : '';
  }
}
