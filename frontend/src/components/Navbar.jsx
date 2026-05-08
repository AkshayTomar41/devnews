import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { Terminal, LogOut, Bookmark, User as UserIcon, Sun, Moon } from 'lucide-react';

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
      <div className="container">
        <Link to="/" className="nav-brand">
          <Terminal size={22} color="var(--accent-color)" />
          <span>HackerNews Clone</span>
        </Link>

        <div className="nav-links">
          {user ? (
            <>
              <Link to="/bookmarks" className="nav-link btn btn-outline btn-sm">
                <Bookmark size={15} /> Bookmarks
              </Link>
              <Link to="/profile" className="nav-link btn btn-outline btn-sm">
                <UserIcon size={15} /> {user.username}
              </Link>
              <button onClick={handleLogout} className="btn btn-outline btn-sm">
                <LogOut size={15} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link btn btn-outline btn-sm">Login</Link>
              <Link to="/register" className="nav-link btn btn-primary btn-sm">Register</Link>
            </>
          )}
          <button className="btn-icon" onClick={toggleTheme} title="Toggle theme" style={{ marginLeft: '0.25rem' }}>
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
