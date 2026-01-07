import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getNotes, createNote, deleteNote } from '../services/api';

function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await getNotes();
      setNotes(response.data.notes);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
      setError('Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('audio', file);
    formData.append('title', file.name.replace(/\.[^/.]+$/, ''));

    try {
      await createNote(formData);
      fetchNotes();
    } catch (err) {
      setError('Failed to upload note');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;

    try {
      await deleteNote(id);
      setNotes(notes.filter(note => note.id !== id));
    } catch (err) {
      setError('Failed to delete note');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <header>
        <h1>SpeakNotes</h1>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </header>

      {error && <p className="error">{error}</p>}

      <div className="upload-section">
        <label className="upload-btn">
          {uploading ? 'Uploading...' : 'Upload Audio'}
          <input
            type="file"
            accept=".mp3,.wav,.m4a"
            onChange={handleUpload}
            disabled={uploading}
            hidden
          />
        </label>
      </div>

      <div className="notes-list">
        {notes.length === 0 ? (
          <p>No notes yet. Upload your first audio note.</p>
        ) : (
          notes.map(note => (
            <div key={note.id} className="note-card">
              <h3>{note.title || 'Untitled'}</h3>
              <p className="note-date">
                {new Date(note.createdAt).toLocaleDateString()}
              </p>
              {note.tags && note.tags.length > 0 && (
                <div className="tags">
                  {note.tags.map((tag, i) => (
                    <span key={i} className="tag">{tag}</span>
                  ))}
                </div>
              )}
              <div className="note-actions">
                <Link to={`/notes/${note.id}`} className="view-btn">View</Link>
                <button onClick={() => handleDelete(note.id)} className="delete-btn">
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;