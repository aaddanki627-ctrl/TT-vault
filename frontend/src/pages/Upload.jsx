import {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import api from '../api/axios.js';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('General');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const nav = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    if (!file) {
      setMessage('Choose a file before uploading.');
      return;
    }
    setMessage('');
    setSubmitting(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title.trim() || file.name);
    formData.append('category', category.trim() || 'General');
    try {
      await api.post('/documents/upload', formData);
      nav('/');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="wrap page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Add to your library</p>
          <h1>Upload a document</h1>
          <p className="subtle">Keep your files organized and ready to share securely.</p>
        </div>
        <Link className="button button-secondary" to="/">Back to documents</Link>
      </div>
      <section className="card form-card">
        <h1>Document details</h1>
        <p className="subtle">Add a title and category so your document is easy to find.</p>
        {message && <div className="error-message" role="alert" style={{marginBottom: 16}}>{message}</div>}
        <form className="stack" onSubmit={submit}>
          <div className="field">
            <label htmlFor="document-title">Document title</label>
            <input id="document-title" placeholder={file?.name || 'e.g. Q4 business plan'} value={title} onChange={(event) => setTitle(event.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="document-category">Category</label>
            <input id="document-category" placeholder="General" value={category} onChange={(event) => setCategory(event.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="document-file">Choose a file</label>
            <div className="file-drop">
              <input id="document-file" type="file" accept=".pdf,.docx,.txt,.png,.jpg,.jpeg" onChange={(event) => setFile(event.target.files?.[0] || null)} required />
              <p className="helper" style={{margin: '10px 0 0'}}>PDF, DOCX, TXT, PNG or JPG. Maximum file size: 10 MB.</p>
            </div>
          </div>
          <button className="button" type="submit" disabled={submitting}>{submitting ? 'Uploading...' : 'Upload document'}</button>
        </form>
      </section>
    </main>
  );
}
