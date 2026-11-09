import {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useAuth} from '../context/AuthContext.jsx';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const {login} = useAuth();
  const nav = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    setErr('');
    setSubmitting(true);
    try {
      await login(email, password);
      nav('/');
    } catch (error) {
      setErr(error.response?.data?.message || 'Unable to sign in. Check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const useDemo = (account) => {
    setEmail(account.email);
    setPassword(account.password);
    setErr('');
  };

  return (
    <main className="auth-shell">
      <section className="auth-story">
        <Link className="brand" to="/">
          <span className="brand-mark">TV</span>
          <span>TrustVault</span>
        </Link>
        <div className="auth-copy">
          <p className="eyebrow">Private by design</p>
          <h1>Your documents, in safe hands.</h1>
          <p>One calm, secure place to store important files and share them with the people you trust.</p>
        </div>
        <p className="auth-footnote">Secure document access for your team.</p>
      </section>

      <section className="auth-panel">
        <div className="auth-content">
          <p className="eyebrow">Welcome back</p>
          <h2>Sign in to TrustVault</h2>
          <p className="subtle">Enter your account details to continue to your workspace.</p>
          {err && <div className="error-message" role="alert">{err}</div>}
          <form className="auth-form" onSubmit={submit}>
            <div className="field">
              <label htmlFor="login-email">Email address</label>
              <input id="login-email" type="email" autoComplete="email" placeholder="you@company.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </div>
            <div className="field">
              <label htmlFor="login-password">Password</label>
              <input id="login-password" type="password" autoComplete="current-password" placeholder="Enter your password" value={password} onChange={(event) => setPassword(event.target.value)} required />
            </div>
            <button className="button" type="submit" disabled={submitting}>{submitting ? 'Signing in...' : 'Sign in'}</button>
          </form>

          <p className="auth-switch">New to TrustVault? <Link to="/register">Create an account</Link></p>

        </div>
      </section>
    </main>
  );
}
