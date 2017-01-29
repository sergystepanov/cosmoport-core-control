import React, { Component } from 'react';
import EventTableRow from './EventTableRow';

class EventTable extends Component {
  render() {
    var rows = [];
    var i = 1;
var events_ = [{"id":1,"type":"МАСТЕР-КЛАСС/ЭКЗОБИОЛОГИЯ","duration":30,"destination":"ЛУНА","cost":20.0,"status":"inactive","bought":5,"departureTime":540,"gateNo":1,"passengersMax":10,"dateAdded":2017},{"id":2,"type":"ЭКСКУРСИЯ/ЗАПУСК СТАНЦИИ","duration":80,"destination":"ВОКРУГ ЗЕМЛИ","cost":30.0,"status":"inactive","bought":10,"departureTime":570,"gateNo":1,"passengersMax":20,"dateAdded":2017},{"id":3,"type":"МИССИЯ/НА КРАЙ ВСЕЛЕННОЙ","duration":45,"destination":"МАРС","cost":45.0,"status":"boarding","bought":10,"departureTime":600,"gateNo":2,"passengersMax":20,"dateAdded":2017},{"id":4,"type":"МАСТЕР-КЛАСС/ЭКЗОБИОЛОГИЯ","duration":120,"destination":"ЮПИТЕР","cost":12.0,"status":"pending","bought":10,"departureTime":660,"gateNo":2,"passengersMax":10,"dateAdded":2017},{"id":5,"type":"МИССИЯ/ЗАПУСК СТАНЦИИ","duration":90,"destination":"ЛУНА","cost":45.0,"status":"pending","bought":2,"departureTime":750,"gateNo":3,"passengersMax":10,"dateAdded":2017},{"id":6,"type":"МИССИЯ ЗАПУСК СТАНЦИИ","duration":30,"destination":"ВОКРУГ ЗЕМЛИ","cost":67.0,"status":"canceled","bought":2,"departureTime":840,"gateNo":3,"passengersMax":10,"dateAdded":2017},{"id":7,"type":"МАСТЕР-КЛАСС/ЭКЗОБИОЛОГИЯ","duration":80,"destination":"МАРС","cost":23.0,"status":"preorder","bought":22,"departureTime":900,"gateNo":4,"passengersMax":100,"dateAdded":2017},{"id":8,"type":"ЭКСКУРСИЯ/ЗАПУСК СТАНЦИИ","duration":45,"destination":"ЮПИТЕР","cost":45.0,"status":"pending","bought":10,"departureTime":1005,"gateNo":4,"passengersMax":200,"dateAdded":2017},{"id":9,"type":"МИССИЯ/ЗАПУСК СТАНЦИИ","duration":120,"destination":"ЛУНА","cost":68.0,"status":"pending","bought":1,"departureTime":1020,"gateNo":5,"passengersMax":3,"dateAdded":2017},{"id":10,"type":"ЭКСКУРСИЯ/ЗАПУСК СТАНЦИИ","duration":90,"destination":"ВОКРУГ ЗЕМЛИ","cost":34.0,"status":"pending","bought":20,"departureTime":1080,"gateNo":6,"passengersMax":30,"dateAdded":2017}];

    this.props.events.forEach(function(event) {
      rows.push(<EventTableRow event={event} key={i} />);
      i++;
    });

    return (
      <table className="pt-table pt-striped">
        <thead>
          <tr>
            <th>Отправление</th>
						<th>Тип рейса</th>
						<th>Направление</th>
						<th>Стоимость</th>
						<th>Длительность</th>
						<th>Статус</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  }
}

export default EventTable;
