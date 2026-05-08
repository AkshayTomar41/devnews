import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Terminal, LogOut, Bookmark, User as UserIcon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="nav-brand">
          <Terminal size={24} color="#f59e0b" />
          <span>HackerNews Clone</span>
        </Link>
        <div className="nav-links">
          {user ? (
            <>
              <Link to="/bookmarks" className="nav-link btn btn-outline">
                <Bookmark size={18} /> Bookmarks
              </Link>
              <div className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <UserIcon size={18} /> {user.username}
              </div>
              <button onClick={handleLogout} className="btn btn-outline">
                <LogOut size={18} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link btn btn-outline">Login</Link>
              <Link to="/register" className="nav-link btn btn-primary">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
