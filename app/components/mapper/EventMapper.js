
export default class EventMapper {
  static fromForm = (object) =>
    ({
      id: object.id || 0,
      contestants: object.bought,
      cost: object.cost,
      event_date: object.date,
      event_destination_id: object.destination,
      duration_time: object.duration,
      gate_id: object.gate,
      people_limit: object.limit,
      repeat_interval: object.repeat_interval,
      event_status_id: object.status,
      start_time: object.time,
      event_type_id: object.type
    })
}
