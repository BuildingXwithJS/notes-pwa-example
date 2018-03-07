import React from 'react';

export default class CreateNote extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
      title: '',
      expires: '',
    };
  }

  handleTitleChange(e) {
    this.setState({title: e.target.value});
  }

  handleTextChange(e) {
    this.setState({text: e.target.value});
  }

  handleExpiresChange(e) {
    this.setState({expires: e.target.value});
  }

  handleAdd(e) {
    e.preventDefault();

    this.props.handleNewNote(this.state);
    this.setState({text: '', title: '', expires: ''});
  }

  render() {
    return (
      <div style={{marginBottom: 30}}>
        <div className="field">
          <label className="label">Title</label>
          <div className="control">
            <input
              className="input"
              type="text"
              placeholder="Note title"
              value={this.state.title}
              onChange={e => this.handleTitleChange(e)}
            />
          </div>
        </div>
        <div className="field">
          <label className="label">Text</label>
          <div className="control">
            <input
              className="input"
              type="text"
              placeholder="Text input"
              value={this.state.text}
              onChange={e => this.handleTextChange(e)}
            />
          </div>
        </div>
        <div className="field">
          <label className="label">Expiration time</label>
          <div className="control">
            <input
              className="input"
              type="datetime-local"
              placeholder="Expiration time"
              value={this.state.expires}
              onChange={e => this.handleExpiresChange(e)}
            />
          </div>
        </div>
        <button className="button" onClick={e => this.handleAdd(e)}>
          Add note
        </button>
      </div>
    );
  }
}
