import React from 'react';
import fetch from 'isomorphic-unfetch';
import PouchDB from 'pouchdb';

import Layout from '../components/layout';
import Note from '../components/note';
import CreateNote from '../components/createNote';

const db = new PouchDB('notes');

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

  async componentDidMount() {
    if ('serviceWorker' in navigator) {
      try {
        const reg = await navigator.serviceWorker.register('/service-worker.js');
        console.log('Registration succeeded. Scope is ', reg);
      } catch (error) {
        // registration failed
        console.log('Registration failed with ', error);
      }
    }
  }

  async addNewNote(note) {
    const fetchConfig = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const body = JSON.stringify({note});
    const addedNote = await fetch('/notes', {...fetchConfig, body})
      .then(r => r.json())
      .then(async newNote => {
        const {rows: allDocs} = await db.allDocs({include_docs: true});
        if (allDocs.length > 0) {
          console.log('saving docs:', allDocs);
          await Promise.all(
            allDocs.map(async ({doc}) => {
              console.log('saving:', doc);
              const noteToSave = {...doc};
              delete noteToSave._id;
              delete noteToSave._rev;
              await fetch('/notes', {...fetchConfig, body: JSON.stringify({note: noteToSave})});
              await db.remove(doc._id, doc._rev);
            })
          );
        }
        return newNote;
      })
      .catch(async e => {
        console.error(e);
        await db.put({_id: String(this.state.notes.length + 1), ...note});
        return note;
      });

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
