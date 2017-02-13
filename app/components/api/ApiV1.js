export default class ApiV1 {
  constructor() {
    this.address = 'http://127.0.0.1:8080';
  }

  request(uri, onSuccess, onFailure) {
    fetch(this.address + uri, { mode: 'cors' }).then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Network response was not ok.');
    })
      .then(onSuccess)
      .catch(onFailure);
  }

  fetchEvents(onSuccess, onFailure) {
    this.request('/test', onSuccess, onFailure);
  }

  fetchTimetable(onSuccess, onFailure) {
    this.request('/timetable', onSuccess, onFailure);
  }

  fetchReferenceData(onSuccess, onFailure) {
    this.request('/t_events/reference_data', onSuccess, onFailure);
  }

  fetchTime(onSuccess, onFailure) {
    this.request('/time', onSuccess, onFailure);
  }

  addEvent(data, onSuccess, onFailure) {
    fetch(`${this.address}/test/event`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Network response was not ok.');
    })
      .then(onSuccess)
      .catch(onFailure);
  }

  deleteEvent(id, onSuccess, onFailure) {
    this.request(`/test/delete?id=${id}`, onSuccess, onFailure);
  }
}
