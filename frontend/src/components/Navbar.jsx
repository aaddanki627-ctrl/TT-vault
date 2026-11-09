import {Link, NavLink} from 'react-router-dom';
import {useAuth} from '../context/AuthContext.jsx';

export default function Navbar() {
  const {user, logout} = useAuth();

  return (
    <header className="topbar">
      <div className="wrap topbar-inner">
        <Link className="brand" to="/">
          <span className="brand-mark">TV</span>
          <span>TrustVault</span>
        </Link>
        <nav className="nav-links" aria-label="Main navigation">
          <NavLink className={({isActive}) => `nav-link${isActive ? ' active' : ''}`} to="/">Documents</NavLink>
          {user && <NavLink className={({isActive}) => `nav-link${isActive ? ' active' : ''}`} to="/upload">Upload</NavLink>}
          {user?.role === 'ADMIN' && <NavLink className={({isActive}) => `nav-link${isActive ? ' active' : ''}`} to="/audit">Audit trail</NavLink>}
        </nav>
        <div className="nav-actions">
          {user ? (
            <>
              <div className="user-chip">
                <span className="avatar">{user.name?.slice(0, 1).toUpperCase()}</span>
                <span>{user.name}<br /><small>{user.role}</small></span>
              </div>
              <button className="button button-secondary" onClick={logout}>Sign out</button>
            </>
          ) : (
            <>
              <Link className="nav-link" to="/login">Sign in</Link>
              <Link className="button" to="/register">Create account</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
