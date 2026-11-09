import {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useAuth} from '../context/AuthContext.jsx';

const demoAccounts = [
  {label: 'Administrator', email: 'admin@trustvault.demo', password: 'DemoAdmin!2026'},
  {label: 'Document owner', email: 'owner@trustvault.demo', password: 'DemoOwner!2026'},
  {label: 'Viewer', email: 'viewer@trustvault.demo', password: 'DemoViewer!2026'},
];

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

          <div className="demo-box">
            <div className="demo-box-head">
              <strong>Try a demo account</strong>
              <span>Run <code>npm run seed:demo</code> in backend</span>
            </div>
            <div className="demo-list">
              {demoAccounts.map((account) => (
                <div className="demo-account" key={account.email}>
                  <div>
                    <strong>{account.label}</strong>
                    <span>{account.email}</span>
                    <code>{account.password}</code>
                  </div>
                  <button className="demo-fill" type="button" onClick={() => useDemo(account)}>Use login</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
