import React from 'react';
import fetch from 'isomorphic-unfetch';
import PouchDB from 'pouchdb';

import Layout from '../components/layout';
import Note from '../components/note';
import CreateNote from '../components/createNote';

const db = new PouchDB('notes');

// push keys, can be fetched from https://web-push-codelab.glitch.me/
const applicationServerPublicKey =
  'BDKOFZa1hweygmvyO1l4G7qGIhD8ewFN6E-wLFmYGHa9f0_aR47YeLLSaaLlN-VGAGf2WsEIGgd2SMnSsU1UkpU';

const urlB64ToUint8Array = base64String => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

const updateSubscriptionOnServer = async subscription => {
  const res = await fetch('/push', {
    method: 'POST',
    body: JSON.stringify({subscription}),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(r => r.json());

  console.log('done', res);
};

export default class HomePage extends React.Component {
  static async getInitialProps() {
    const notes = await fetch('http://localhost:3000/notes').then(r => r.json());
    return {notes};
  }

  constructor(props) {
    super(props);

    this.state = {
      notes: props.notes || [],
      isSubscribed: false,
    };
  }

  async componentDidMount() {
    if ('serviceWorker' in navigator) {
      try {
        // const reg = await navigator.serviceWorker.register('/service-worker.js');
        const regPush = await navigator.serviceWorker.register('/push-worker.js');
        this.pushRegistration = regPush;
        // console.log('Registration succeeded. Scope is ', reg, regPush);

        const sub = await regPush.pushManager.getSubscription();
        const isSubscribed = sub !== null;
        this.setState({isSubscribed});

        if (isSubscribed) {
          console.log('User IS subscribed.');
        } else {
          console.log('User is NOT subscribed.');
        }
      } catch (error) {
        // registration failed
        console.log('Registration failed with ', error);
      }
    }
  }

  toggleNotificaitons() {
    if (this.state.isSubscribed) {
      this.pushRegistration.pushManager
        .getSubscription()
        .then(subscription => {
          if (subscription) {
            return subscription.unsubscribe();
          }
        })
        .catch(error => {
          console.log('Error unsubscribing', error);
        });
      return;
    }

    const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
    this.pushRegistration.pushManager
      .subscribe({
        userVisibleOnly: true,
        applicationServerKey,
      })
      .then(subscription => {
        console.log('User is subscribed.');

        updateSubscriptionOnServer(subscription);

        this.setState({isSubscribed: true});
      })
      .catch(err => {
        console.log('Failed to subscribe the user: ', err);
      });
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
          await Promise.all(
            allDocs.map(async ({doc}) => {
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
          <button className="button" onClick={() => this.toggleNotificaitons()}>
            {this.state.isSubscribed ? 'Unsubscribe from notifications' : 'Subscribe to notifications'}
          </button>

          <CreateNote handleNewNote={note => this.addNewNote(note)} />

          <div className="tile is-ancestor">{this.state.notes.map(note => <Note key={note.id} note={note} />)}</div>
        </div>
      </Layout>
    );
  }
}
