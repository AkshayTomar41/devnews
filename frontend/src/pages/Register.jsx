import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';
import { Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';

const Register = () => {
  const [fullName, setFullName] = useState('');
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
      const { data } = await axios.post('http://localhost:5000/api/auth/register', { 
        fullName, 
        username, 
        password 
      });
      login(data);
      addToast(`🎉 Welcome to the community, ${data.fullName || data.username}!`, 'success');
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
    <div className="container" style={{ paddingBottom: '5rem' }}>
      <div className="auth-card" style={{ maxWidth: '500px' }}>
        <h2 className="text-center">Join DevNews</h2>
        <p className="auth-subtitle text-center">Create your account to save stories and join discussions</p>
        
        {error && <div className="error-text text-center mb-4">{error}</div>}
        
        <form onSubmit={submitHandler}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. John Doe" 
              value={fullName} 
              onChange={e => setFullName(e.target.value)} 
              required 
              autoFocus 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Gmail / Email</label>
            <input 
              type="email" 
              className="form-input" 
              placeholder="e.g. john@gmail.com" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group" style={{ position: 'relative' }}>
            <label className="form-label">Password</label>
            <input 
              type={showPw ? 'text' : 'password'} 
              className="form-input" 
              placeholder="Create a strong password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
              style={{ paddingRight: '2.75rem' }} 
            />
            <button 
              type="button" 
              onClick={() => setShowPw(!showPw)} 
              style={{ position: 'absolute', right: '0.75rem', top: '2.25rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
            
            {pwStrength && (
              <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'var(--border-color)' }}>
                  <div style={{ height: '100%', borderRadius: 2, background: pwColors[pwStrength], width: pwStrength === 'weak' ? '33%' : pwStrength === 'medium' ? '66%' : '100%', transition: 'all 0.3s' }} />
                </div>
                <span style={{ fontSize: '0.75rem', color: pwColors[pwStrength], fontWeight: 700, textTransform: 'capitalize' }}>{pwStrength}</span>
              </div>
            )}
          </div>

          <div className="form-group" style={{ position: 'relative' }}>
            <label className="form-label">Confirm Password</label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="Confirm your password" 
              value={confirmPassword} 
              onChange={e => setConfirmPassword(e.target.value)} 
              required 
            />
            {confirmPassword && (
              <span style={{ position: 'absolute', right: '0.75rem', top: '2.25rem', color: password === confirmPassword ? 'var(--success-color)' : 'var(--danger-color)' }}>
                {password === confirmPassword ? <CheckCircle size={18} /> : <XCircle size={18} />}
              </span>
            )}
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.875rem', marginTop: '1rem' }} disabled={loading}>
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
