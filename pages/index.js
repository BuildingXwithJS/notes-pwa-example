import React from 'react';
import fetch from 'isomorphic-unfetch';

import Layout from '../components/layout';
import Note from '../components/note';
import CreateNote from '../components/createNote';

export default class HomePage extends React.Component {
  static async getInitialProps() {
    const notes = await fetch('http://localhost:3000/notes').then(r => r.json());
    return {notes};
  }

  constructor(props) {
    super(props);

    this.state = {
      notes: props.notes || [],
    };
  }

  async addNewNote(note) {
    const body = JSON.stringify({note});
    const addedNote = await fetch('/notes', {
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(r => r.json());

    const newNotes = this.state.notes.concat([addedNote]);
    this.setState({notes: newNotes});
  }

  render() {
    return (
      <Layout>
        <div className="container">
          <CreateNote handleNewNote={note => this.addNewNote(note)} />

          <div className="tile is-ancestor">{this.state.notes.map(note => <Note key={note.id} note={note} />)}</div>
        </div>
      </Layout>
    );
  }
}
