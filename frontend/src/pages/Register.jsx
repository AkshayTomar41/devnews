import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';
import { Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const navigate = useNavigate();

  useEffect(() => { if (user) navigate('/'); }, [user, navigate]);

  const pwStrength = password.length === 0 ? null : password.length < 6 ? 'weak' : password.length < 10 ? 'medium' : 'strong';
  const pwColors = { weak: '#ef4444', medium: '#f59e0b', strong: '#10b981' };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) { setError('Passwords do not match'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    try {
      setLoading(true);
      setError('');
      const { data } = await axios.post('http://localhost:5000/api/auth/register', { username, password });
      login(data);
      addToast(`🎉 Welcome, ${data.username}!`, 'success');
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      setError(msg);
      addToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="auth-card">
        <h2 className="text-center">Create Account</h2>
        <p className="auth-subtitle text-center">Join the HackerNews community</p>
        {error && <div className="error-text text-center mb-4">{error}</div>}
        <form onSubmit={submitHandler}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input type="text" className="form-input" placeholder="Choose a username" value={username} onChange={e => setUsername(e.target.value)} required autoFocus />
          </div>
          <div className="form-group" style={{ position: 'relative' }}>
            <label className="form-label">Password</label>
            <input type={showPw ? 'text' : 'password'} className="form-input" placeholder="Create a password" value={password} onChange={e => setPassword(e.target.value)} required style={{ paddingRight: '2.75rem' }} />
            <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: '0.75rem', top: '2.25rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}>
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
            {pwStrength && (
              <div style={{ marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'var(--border-color)' }}>
                  <div style={{ height: '100%', borderRadius: 2, background: pwColors[pwStrength], width: pwStrength === 'weak' ? '33%' : pwStrength === 'medium' ? '66%' : '100%', transition: 'width 0.3s, background 0.3s' }} />
                </div>
                <span style={{ fontSize: '0.75rem', color: pwColors[pwStrength], fontWeight: 600, textTransform: 'capitalize' }}>{pwStrength}</span>
              </div>
            )}
          </div>
          <div className="form-group" style={{ position: 'relative' }}>
            <label className="form-label">Confirm Password</label>
            <input type="password" className="form-input" placeholder="Confirm your password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required style={{ paddingRight: '2.75rem' }} />
            {confirmPassword && (
              <span style={{ position: 'absolute', right: '0.75rem', top: '2.25rem', color: password === confirmPassword ? 'var(--success-color)' : 'var(--danger-color)' }}>
                {password === confirmPassword ? <CheckCircle size={16} /> : <XCircle size={16} />}
              </span>
            )}
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <hr className="divider" />
        <p className="text-center text-secondary" style={{ fontSize: '0.875rem' }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
