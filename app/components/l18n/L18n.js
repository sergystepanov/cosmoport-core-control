export default class L18n {
  constructor(locale, refs) {
    this.locale = locale;
    this.refs = refs;
  }

  findEventRefByEventTypeId(eventTypeId) {
    return this.findEventById(eventTypeId, 'types');
  }

  findEventRefByEventStatusId(eventStatusId) {
    return this.findEventById(eventStatusId, 'statuses');
  }

  findEventRefByEventDestinationId(eventDestinationId) {
    return this.findEventById(eventDestinationId, 'destinations');
  }

  findEventById(id, property) {
    let result = false;

    for (const eventProp of this.refs[property]) {
      if (eventProp.id === id) {
        result = eventProp;
        break;
      }
    }

    return result;
  }

  findTranslationById(ref, name) {
    const data = this.locale[ref[name]];

    return ref && data ? data.values[0] : name;
  }
}
