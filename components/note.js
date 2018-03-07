import React from 'react';

export default ({note}) => (
  <div className="tile is-child">
    <div className="card">
      <header className="card-header">
        <p className="card-header-title">{note.title}</p>
      </header>
      <div className="card-content">
        <div className="content">
          {note.text}
          <p>Expires at: {new Date(note.expires).toLocaleString()}</p>
        </div>
      </div>
    </div>
  </div>
);
