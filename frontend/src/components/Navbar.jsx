import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { Terminal, LogOut, Bookmark, User as UserIcon, Sun, Moon, Newspaper } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" className="nav-brand">
          <Terminal size={24} strokeWidth={3} style={{ color: 'var(--primary-color)' }} />
          <span>DevNews</span>
        </Link>

        <div className="nav-links">
          {user ? (
            <>
              <Link to="/" className="nav-link btn btn-outline btn-sm" style={{ border: 'none' }}>
                <Newspaper size={16} /> <span className="hide-mobile">Feed</span>
              </Link>
              <Link to="/bookmarks" className="nav-link btn btn-outline btn-sm" style={{ border: 'none' }}>
                <Bookmark size={16} /> <span className="hide-mobile">Bookmarks</span>
              </Link>
              <Link to="/profile" className="nav-link btn btn-outline btn-sm" style={{ border: 'none' }}>
                <UserIcon size={16} /> <span className="hide-mobile">{user.fullName || user.username}</span>
              </Link>
              <button onClick={handleLogout} className="btn btn-outline btn-sm" style={{ border: 'none' }}>
                <LogOut size={16} /> <span className="hide-mobile">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/" className="nav-link" style={{ marginRight: '1rem' }}>Feed</Link>
              <Link to="/login" className="nav-link" style={{ marginRight: '0.5rem' }}>Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Join Community</Link>
            </>
          )}
          <div style={{ width: '1px', height: '24px', background: 'var(--border-color)', margin: '0 0.5rem' }}></div>
          <button className="btn-icon" onClick={toggleTheme} title="Toggle theme" style={{ border: 'none', background: 'var(--surface-hover)' }}>
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
