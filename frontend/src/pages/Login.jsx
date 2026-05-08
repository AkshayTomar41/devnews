import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const navigate = useNavigate();

  useEffect(() => { if (user) navigate('/'); }, [user, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      const { data } = await axios.post('http://localhost:5000/api/auth/login', { username, password });
      login(data);
      addToast(`👋 Welcome back, ${data.username}!`, 'success');
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      setError(msg);
      addToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="auth-card">
        <h2 className="text-center">Welcome back</h2>
        <p className="auth-subtitle text-center">Sign in to your account</p>
        {error && <div className="error-text text-center mb-4">{error}</div>}
        <form onSubmit={submitHandler}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input type="text" className="form-input" placeholder="Enter username" value={username} onChange={e => setUsername(e.target.value)} required autoFocus />
          </div>
          <div className="form-group" style={{ position: 'relative' }}>
            <label className="form-label">Password</label>
            <input type={showPw ? 'text' : 'password'} className="form-input" placeholder="Enter password" value={password} onChange={e => setPassword(e.target.value)} required style={{ paddingRight: '2.75rem' }} />
            <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: '0.75rem', top: '2.25rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}>
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <hr className="divider" />
        <p className="text-center text-secondary" style={{ fontSize: '0.875rem' }}>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
