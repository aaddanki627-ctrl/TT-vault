import {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useAuth} from '../context/AuthContext.jsx';

export default function Register() {
  const [form, setForm] = useState({name: '', email: '', password: '', role: 'VIEWER'});
  const [err, setErr] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const {register} = useAuth();
  const nav = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    setErr('');
    setSubmitting(true);
    try {
      await register(form);
      nav('/');
    } catch (error) {
      setErr(error.response?.data?.message || 'Unable to create your account. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const update = (event) => setForm({...form, [event.target.name]: event.target.value});

  return (
    <main className="auth-shell">
      <section className="auth-story">
        <Link className="brand" to="/">
          <span className="brand-mark">TV</span>
          <span>TrustVault</span>
        </Link>
        <div className="auth-copy">
          <p className="eyebrow">A better way to share</p>
          <h1>Keep what matters close.</h1>
          <p>Create a secure workspace for your files. You choose what to upload and who can access it.</p>
        </div>
        <p className="auth-footnote">Your files stay yours. Share with care.</p>
      </section>

      <section className="auth-panel">
        <div className="auth-content">
          <p className="eyebrow">Get started</p>
          <h2>Create your account</h2>
          <p className="subtle">A few details and your TrustVault workspace is ready.</p>
          {err && <div className="error-message" role="alert">{err}</div>}
          <form className="auth-form" onSubmit={submit}>
            <div className="field">
              <label htmlFor="register-name">Full name</label>
              <input id="register-name" name="name" autoComplete="name" placeholder="Your name" value={form.name} onChange={update} required />
            </div>
            <div className="field">
              <label htmlFor="register-email">Email address</label>
              <input id="register-email" name="email" type="email" autoComplete="email" placeholder="you@company.com" value={form.email} onChange={update} required />
            </div>
            <div className="field">
              <label htmlFor="register-password">Password</label>
              <input id="register-password" name="password" type="password" autoComplete="new-password" minLength={8} placeholder="At least 8 characters" value={form.password} onChange={update} required />
            </div>
            <div className="field">
              <label htmlFor="register-role">Workspace role</label>
              <select id="register-role" name="role" value={form.role} onChange={update}>
                <option value="VIEWER">Viewer</option>
                <option value="OWNER">Owner</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <button className="button" type="submit" disabled={submitting}>{submitting ? 'Creating account...' : 'Create account'}</button>
          </form>
          <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
        </div>
      </section>
    </main>
  );
}
