export default class L18n {
  constructor(locale, refs) {
    this.locale = locale;
    this.refs = refs;
  }

  findEventRefByEventTypeId(eventTypeId) {
    let result = false;

    for (const eventType of this.refs.types) {
      if (eventType.id === eventTypeId) {
        result = eventType;
        break;
      }
    }

    return result;
  }

  findTranslationById(ref, name) {
    return ref
      ? this.locale[ref[name]].values[0]
      : name;
  }
}
