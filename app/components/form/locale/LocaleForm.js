import React, {Component} from 'react';

export default class LocaleForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      code: '',
      description: ''
    };

    this.handleInputChange = this
      .handleInputChange
      .bind(this);

    this.getFormData = this
      .getFormData
      .bind(this)
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox'
      ? target.checked
      : target.value;
    const name = target.name;

    this.setState({[name]: value});
  }

  getFormData() {
    return this.state;
  }

  render() {
    return (
      <div ref="container">
        <label className="pt-label pt-inline">
          <span>Code</span>
          <input
            name="code"
            className="pt-input .modifier"
            type="text"
            placeholder="The locale code (two letters)"
            dir="auto"
            value={this.state.code}
            onChange={this.handleInputChange}/>
        </label>
        <label className="pt-label pt-inline">
          <span>Description</span>
          <input
            name="description"
            className="pt-input pt-inline"
            type="text"
            placeholder="Locale description"
            dir="auto"
            value={this.state.description}
            onChange={this.handleInputChange}/>
        </label>
      </div>
    );
  }
}
