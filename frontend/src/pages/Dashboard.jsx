import {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import api from '../api/axios.js';

export default function Dashboard() {
  const [docs, setDocs] = useState([]);
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    api.get('/documents', {params: {q: search}})
      .then((response) => {
        if (active) setDocs(response.data.documents || []);
      })
      .catch((requestError) => {
        if (active) setError(requestError.response?.data?.message || 'Could not load your documents. Please try again.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [search]);

  const submitSearch = (event) => {
    event.preventDefault();
    setSearch(query.trim());
  };

  return (
    <main className="wrap page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Your workspace</p>
          <h1>Documents</h1>
          <p className="subtle">Your secure library for the files that matter.</p>
        </div>
        <Link className="button" to="/upload">+ Upload a document</Link>
      </div>
      <form className="toolbar" onSubmit={submitSearch}>
        <div className="search-box">
          <span className="search-mark" aria-hidden="true">⌕</span>
          <input aria-label="Search documents" placeholder="Search by document title" value={query} onChange={(event) => setQuery(event.target.value)} />
        </div>
        <button className="button button-secondary" type="submit">Search</button>
      </form>

      {error && <div className="error-message inline-error" role="alert">{error}</div>}
      {loading ? (
        <p className="subtle" style={{marginTop: 28}}>Loading your documents...</p>
      ) : !error && docs.length === 0 ? (
        <section className="empty-state" style={{marginTop: 24}}>
          <span className="empty-icon" aria-hidden="true">▤</span>
          <h2>{search ? 'No matching documents' : 'Your library is ready'}</h2>
          <p>{search ? 'Try another title or clear your search.' : 'Upload your first document to get started.'}</p>
          {!search && <Link className="button" to="/upload">Upload a document</Link>}
        </section>
      ) : (
        <section className="document-grid" style={{marginTop: 24}}>
          {docs.map((document) => (
            <article className="card document-card" key={document._id}>
              <div className="document-top">
                <span className="file-icon" aria-hidden="true">{document.fileName?.split('.').pop()?.slice(0, 4).toUpperCase() || 'FILE'}</span>
                <span className="category-pill">{document.category || 'General'}</span>
              </div>
              <h2 title={document.title}>{document.title}</h2>
              <p className="meta">Owned by {document.owner?.name || 'Unknown'}</p>
              <div className="document-footer">
                <span>{document.createdAt ? new Date(document.createdAt).toLocaleDateString() : ''}</span>
                <Link className="text-link" to={`/doc/${document._id}`}>View document &rarr;</Link>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
