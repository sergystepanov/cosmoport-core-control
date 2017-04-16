const defaultUrl = 'http://127.0.0.1:8080';
const defaultHttpHeaders = { Accept: 'application/json', 'Content-Type': 'application/json' };

/**
 * Parses Json value from a network request.
 *
 * @param {object} response The response object from a network request.
 * @return {Promise} promise The parsed Json value, wrapped into a promise.
 */
const parseJson = ((response) => new Promise(
  (resolve) => response.json()
    .then((json) => resolve({ status: response.status, ok: response.ok, json }))
));


/**
 * The main HTTP API v1 client.
 *
 * @since 0.1.0
 */
export default class ApiV11 {
  constructor(url) {
    this.address = url || defaultUrl;

    /**
     * Makes a requests to the API endpoint with some options.
     *
     * @param {string} uri A endpoint URI (like `/something`).
     * @param {object} options The options to pass to fetch.
     *
     * @return {Propmise} The request promise.
     */
    this.request = (uri, options) => new Promise((resolve, reject) => {
      fetch(this.address + uri, Object.assign({}, options, { mode: 'cors' }))
        .then(response => parseJson(response))
        .then(response => (response.ok ? resolve(response.json) : reject(response.json)))
        .catch(error => reject({ code: error.code, message: error.message }));
    });

    this.get = (uri) => this.request(uri, { method: 'GET', headers: defaultHttpHeaders });
    this.post = (uri, data) => this.request(uri, { method: 'POST', headers: defaultHttpHeaders, body: JSON.stringify(data) });
    this.delete = (uri) => this.request(uri, { method: 'DELETE', headers: defaultHttpHeaders });
  }

  // Events
  fetchEvents = () => this.get('/timetable')
  fetchTimetable = () => this.fetchEvents()
  createEvent = (data) => this.post('/timetable', data)
  deleteEvent = (id) => this.delete(`/timetable/${id}`)

  // Translations
  fetchTranslations = () => this.get('/translations')
  fetchTranslationsForLocale = (localeId) => this.get(`/translations/localeId=${localeId}`)
  updateTranslationTextForId = (id, value) => this.post(`/translations/${id}`, value)
  fetchLocales = () => this.get('/translations/locales')
  createLocale = (data) => this.post('/translations/locale', data)

  // References
  fetchReferenceData = () => this.get('/t_events/reference_data')

  // Nodes
  fetchNodes = () => this.get('/nodes')

  // Server
  fetchTime = () => this.get('/time')
}
