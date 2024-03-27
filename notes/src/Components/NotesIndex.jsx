// NotesIndex.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import AuthContext from './AuthContext';
import UpdateNoteModal from './UpdateNoteModal';
import ViewNoteModal from './ViewNoteModal';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css'

const NotesIndex = () => {
  const { user, logout } = useContext(AuthContext);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [selectedNote, setSelectedNote] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  useEffect(() => {
    // Fetch notes when the component is mounted
    axios.get('http://localhost:8000/notes', { withCredentials: true })
      .then(response => {
        setNotes(response.data);
      })
      .catch(error => console.error('Error fetching notes:', error));
  }, []);


  const handleNoteChange = (value, field) => {
    setSelectedNote(prevNote => ({
      ...prevNote,
      [field]: value
    }));
  };

  const handleSaveNote = async () => {
    if (!selectedNote) {
      return;
    }
    try {
      const response = await axios.post('http://localhost:8000/updateNote', selectedNote, { withCredentials: true });
      if (response.data.success) {
        setNotes(notes.map(note => note._id === selectedNote._id ? response.data.note : note));
      }
      setShowUpdateModal(false);
    } catch (error) {
      console.error('Error saving the note:', error);
    }
  }

  const deleteNote = async (_id) => {
    try {
      const response = await axios.post(`http://localhost:8000/deleteNote`, { _id: _id }, { withCredentials: true })
      if (response.data.success) {
        setNotes(notes.filter(note => note._id !== _id));
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    } 
  };

const addNote = () => {
  axios.post('http://localhost:8000/createNote', newNote, { withCredentials: true })
    .then(response => {
      setNotes(prevNotes => {
        const updatedNotes = [...prevNotes, response.data]
        return updatedNotes;
      }); 
      setNewNote({ title: '', content: '' }); 
    })
    .catch(error => console.error('Error adding note:', error));
};

return (
  <div className="container mt-5">
    <h1>Welcome, {user.userName}!</h1>
    <Button onClick={logout} className="btn btn-danger mb-3">Logout</Button>
    {notes.length > 0 ? (
      <>
        <h2>Your Notes</h2>
        {notes.map(note => (
          <div key={note._id} className="note card my-3">
            <div className="card-body">
              <h3 className="card-title">{note.title}</h3>
              <Button variant='primary' className="note-btn view-note-btn" onClick={() => { setSelectedNote(note); setShowViewModal(true); }}>
                View Note
              </Button>
              <Button variant='warning' className="note-btn update-note-btn" onClick={() => { setSelectedNote(note); setShowUpdateModal(true); }}>
                Update Note
              </Button>
              <Button variant='danger' className="note-btn delete-note-btn" onClick={() => deleteNote(note._id)}>Delete Note</Button>
            </div>
          </div>
        ))}
      </>
    ) : (
      <p>You have no notes.</p>
    )}
    <ViewNoteModal
      show={showViewModal}
      onHide={() => setShowViewModal(false)}
      note={selectedNote}
    />
    <UpdateNoteModal
      show={showUpdateModal}
      onHide={() => setShowUpdateModal(false)}
      note={selectedNote}
      onChange={handleNoteChange}
      onSave={handleSaveNote}
    />
    <h2>Add a new note</h2>
    <input
      className="form-control my-2"
      value={newNote.title}
      onChange={e => setNewNote({ ...newNote, title: e.target.value })}
      placeholder="Title"
      required
    />
    <textarea
      className="form-control my-2"
      value={newNote.content}
      onChange={e => setNewNote({ ...newNote, content: e.target.value })}
      placeholder="Content"
      required
    />
    <Button className="createNote" onClick={addNote}>Add Note</Button>
  </div>
);
};

export default NotesIndex;
