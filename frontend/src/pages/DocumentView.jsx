import {useCallback, useEffect, useState} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import api from '../api/axios.js';

export default function DocumentView() {
  const {id} = useParams();
  const nav = useNavigate();
  const [doc, setDoc] = useState(null);
  const [perms, setPerms] = useState([]);
  const [grantId, setGrantId] = useState('');
  const [err, setErr] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  const loadDocument = useCallback(async () => {
    setErr('');
    try {
      const response = await api.get(`/documents/${id}`);
      setDoc(response.data.document);
    } catch (error) {
      setErr(error.response?.data?.message || 'Could not load this document.');
      return;
    }

    try {
      const response = await api.get(`/permissions/${id}`);
      setPerms(response.data.permissions || []);
    } catch {
      setPerms([]);
    }
  }, [id]);

  useEffect(() => {
    loadDocument();
  }, [loadDocument]);

  const download = async () => {
    setErr('');
    setBusy(true);
    try {
      const response = await api.get(`/documents/${id}/download`, {responseType: 'blob'});
      const url = URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.download = doc.fileName;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      setErr(error.response?.data?.message || 'Could not download this document.');
    } finally {
      setBusy(false);
    }
  };

  const grant = async (event) => {
    event.preventDefault();
    setErr('');
    setNotice('');
    setBusy(true);
    try {
      await api.post(`/permissions/${id}/grant`, {userId: grantId.trim(), access: 'READ'});
      setGrantId('');
      setNotice('Read access granted.');
      const response = await api.get(`/permissions/${id}`);
      setPerms(response.data.permissions || []);
    } catch (error) {
      setErr(error.response?.data?.message || 'Could not grant access.');
    } finally {
      setBusy(false);
    }
  };

  const revoke = async (userId) => {
    setErr('');
    setNotice('');
    try {
      await api.delete(`/permissions/${id}/revoke/${userId}`);
      setPerms((current) => current.filter((permission) => permission.user?._id !== userId));
      setNotice('Access revoked.');
    } catch (error) {
      setErr(error.response?.data?.message || 'Could not revoke access.');
    }
  };

  const remove = async () => {
    if (!window.confirm('Delete this document? This cannot be undone.')) return;
    setErr('');
    setBusy(true);
    try {
      await api.delete(`/documents/${id}`);
      nav('/');
    } catch (error) {
      setErr(error.response?.data?.message || 'Could not delete this document.');
      setBusy(false);
    }
  };

  if (err && !doc) {
    return (
      <main className="wrap page">
        <div className="error-message" role="alert">{err}</div>
        <p style={{marginTop: 16}}><Link className="text-link" to="/">Back to documents</Link></p>
      </main>
    );
  }
  if (!doc) return <main className="wrap page"><p className="subtle">Loading document...</p></main>;

  return (
    <main className="wrap page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Document details</p>
          <h1>{doc.title}</h1>
          <p className="subtle">{doc.category || 'General'} · {doc.fileName}</p>
        </div>
        <Link className="button button-secondary" to="/">Back to documents</Link>
      </div>
      <section className="card detail-card">
        {err && <div className="error-message" role="alert">{err}</div>}
        {notice && <div className="success-message" role="status">{notice}</div>}
        <div className="detail-actions">
          <button className="button" onClick={download} disabled={busy}>Download file</button>
          <button className="button button-secondary" onClick={remove} disabled={busy}>Delete document</button>
        </div>
        <hr className="section-divider" />
        <h2>Share access</h2>
        <p className="subtle">Grant read-only access to another TrustVault user.</p>
        <form className="permission-form" onSubmit={grant}>
          <input aria-label="User ID to grant access" placeholder="Enter the user's ID" value={grantId} onChange={(event) => setGrantId(event.target.value)} required />
          <button className="button" type="submit" disabled={busy}>Grant read access</button>
        </form>
        {perms.length > 0 ? perms.map((permission) => (
          <div className="permission-row" key={permission._id}>
            <span>{permission.user?.name || permission.user?.email || 'Shared user'} <span className="muted">· {permission.access}</span></span>
            <button className="button button-quiet" onClick={() => revoke(permission.user?._id)}>Revoke</button>
          </div>
        )) : <p className="helper">No other users have access yet.</p>}
      </section>
    </main>
  );
}
