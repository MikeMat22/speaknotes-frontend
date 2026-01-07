import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getNote } from '../services/api';

function NoteDetail() {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchNote();
  }, [id]);

  const fetchNote = async () => {
    try {
      const response = await getNote(id);
      setNote(response.data.note);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
      setError('Failed to load note');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  if (error) {
    return (
      <div className="container">
        <p className="error">{error}</p>
        <Link to="/dashboard">Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="container">
      <Link to="/dashboard" className="back-link">Back to Dashboard</Link>
      
      <div className="note-detail">
        <h1>{note.title || 'Untitled'}</h1>
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

        <section>
          <h2>Summary</h2>
          {note.summary ? (
            <p>{note.summary}</p>
          ) : (
            <p className="pending">Summary is being generated...</p>
          )}
        </section>

        <section>
          <h2>Transcript</h2>
          {note.transcript ? (
            <p className="transcript">{note.transcript}</p>
          ) : (
            <p className="pending">Transcript is being generated...</p>
          )}
        </section>

        <section>
          <h2>Audio</h2>
          <audio controls src={`http://localhost:3000${note.audioUrl}`}>
            Your browser does not support audio playback.
          </audio>
        </section>
      </div>
    </div>
  );
}

export default NoteDetail;