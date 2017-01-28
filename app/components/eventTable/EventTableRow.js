import React, {Component} from 'react';

class EventTableRow extends Component {
  render() {
    var name = this.props.event.status === 'inactive' ? 'canceled' : '';

    return (
      <tr className="{name}">
        <td>{this.props.event.departureTime}</td>
				<td>
          <span className="type-name">{this.props.event.type}</span>
          {this.props.event.type}
        </td>
				<td>{this.props.event.destination}</td>
				<td>{this.props.event.cost} €</td>
				<td>{this.props.event.duration} мин</td>
				<td>{this.props.event.status}</td>
				</tr>
    );
		}
}


export default EventTableRow;
