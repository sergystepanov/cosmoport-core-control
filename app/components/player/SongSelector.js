import React from 'react';

export default class SongSelector extends React.Component {
  render() {
    return <label>
      Select a song: {' '}
      <select
        value={this
        .props
        .music
        .indexOf(this.props.selectedSong)}
        onChange={this
        .handleSongChange
        .bind(this)}>
        <option></option>
        {this.renderSongOptions()}
      </select>
    </label>;
  }

  renderSongOptions() {
    return this
      .props
      .music
      .map((track, index) => {
        return <option key={index} value={index}>{track}</option>;
      });
  }

  handleSongChange(ev) {
    this
      .props
      .onSongSelected(this.props.music[ev.target.value]);
  }
}
