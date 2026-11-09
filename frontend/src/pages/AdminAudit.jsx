import {useEffect, useState} from 'react';
import api from '../api/axios.js';

export default function AdminAudit() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/audit')
      .then((response) => setLogs(response.data.logs || []))
      .catch((requestError) => setError(requestError.response?.data?.message || 'Could not load the audit trail.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="wrap page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Workspace security</p>
          <h1>Audit trail</h1>
          <p className="subtle">A record of account and document activity.</p>
        </div>
        <span className="category-pill">Administrator only</span>
      </div>
      {error && <div className="error-message" role="alert">{error}</div>}
      {loading ? <p className="subtle">Loading activity...</p> : !error && logs.length === 0 ? (
        <section className="empty-state">
          <span className="empty-icon" aria-hidden="true">◷</span>
          <h2>No activity yet</h2>
          <p>Workspace events will appear here as they happen.</p>
        </section>
      ) : (
        <section className="table-list">
          {logs.map((log) => (
            <article className="card audit-row" key={log._id}>
              <span>{new Date(log.createdAt).toLocaleString()}</span>
              <span>{log.actorEmail || 'System'}</span>
              <strong>{log.action}</strong>
              <span className={`status-pill${log.success ? '' : ' failed'}`}>{log.success ? 'SUCCESS' : 'FAILED'}</span>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
