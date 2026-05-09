import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';
import { Bookmark, MessageCircle, Edit3, Check, X } from 'lucide-react';

const AVATAR_COLORS = [
  '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b',
  '#ef4444', '#ec4899', '#06b6d4', '#84cc16'
];

const getInitial = (user) => (user.fullName ? user.fullName[0] : user.username[0])?.toUpperCase() || '?';

const Profile = () => {
  const { user, login, logout } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const navigate = useNavigate();

  const [stats, setStats] = useState({ bookmarkCount: 0, commentCount: 0 });
  const [bio, setBio] = useState('');
  const [fullName, setFullName] = useState('');
  const [avatarColor, setAvatarColor] = useState('#3b82f6');
  const [editingProfile, setEditingProfile] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    setBio(user.bio || '');
    setFullName(user.fullName || '');
    setAvatarColor(user.avatarColor || '#3b82f6');

    const fetchStats = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/auth/stats', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setStats(data);
      } catch { /* ignore */ }
    };
    fetchStats();
  }, [user, navigate]);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const { data } = await axios.put(
        'http://localhost:5000/api/auth/profile',
        { bio, avatarColor, fullName },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      login({ ...user, bio: data.bio, avatarColor: data.avatarColor, fullName: data.fullName });
      setEditingProfile(false);
      addToast('✅ Profile updated!', 'success');
    } catch {
      addToast('Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    addToast('Logged out successfully', 'info');
  };

  if (!user) return null;

  return (
    <div className="container" style={{ paddingTop: '3rem', paddingBottom: '5rem', maxWidth: '800px' }}>
      
      {/* Profile Header Card */}
      <div className="profile-card" style={{ padding: '3rem', position: 'relative', marginBottom: '2rem', textAlign: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div 
            className="profile-avatar-large" 
            style={{ 
              background: `linear-gradient(135deg, ${avatarColor}, #1e293b)`,
              marginBottom: '1.5rem',
              border: '4px solid white',
              boxShadow: 'var(--shadow-lg)'
            }}
          >
            {getInitial(user)}
          </div>
          
          {editingProfile ? (
            <div style={{ width: '100%', maxWidth: '400px' }}>
              <div className="form-group">
                <label className="form-label" style={{ textAlign: 'left' }}>Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Enter your name"
                  style={{ textAlign: 'center' }}
                />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ textAlign: 'left' }}>Bio</label>
                <textarea
                  className="form-input"
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  rows={3}
                  placeholder="Tell us about yourself..."
                  style={{ textAlign: 'center' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '1rem' }}>
                <button className="btn btn-primary btn-sm" onClick={handleSaveProfile} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button className="btn btn-outline btn-sm" onClick={() => setEditingProfile(false)}>Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <h1 style={{ fontSize: '2.5rem', marginBottom: '0.25rem', letterSpacing: '-0.02em' }}>
                {user.fullName || "Your Name"}
              </h1>
              <p style={{ color: 'var(--primary-color)', fontWeight: 600, fontSize: '1rem', marginBottom: '1.25rem' }}>
                {user.username}
              </p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto 1.5rem' }}>
                {user.bio || "Welcome to your profile. You haven't added a bio yet."}
              </p>
              <button className="btn btn-outline btn-sm" onClick={() => setEditingProfile(true)}>
                <Edit3 size={14} /> Edit Profile
              </button>
            </>
          )}
        </div>

        {/* Color Picker inside header card when editing */}
        {editingProfile && (
          <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
            <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Choose your brand color</p>
            <div className="color-picker-row" style={{ justifyContent: 'center' }}>
              {AVATAR_COLORS.map(c => (
                <div
                  key={c}
                  className={`color-dot ${avatarColor === c ? 'selected' : ''}`}
                  style={{ background: c, width: '32px', height: '32px' }}
                  onClick={() => setAvatarColor(c)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="profile-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <div style={{ color: 'var(--primary-color)', marginBottom: '0.5rem' }}>
            <Bookmark size={32} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{stats.bookmarkCount}</div>
          <div style={{ color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>Saved Stories</div>
        </div>

        <div className="profile-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <div style={{ color: 'var(--accent-color)', marginBottom: '0.5rem' }}>
            <MessageCircle size={32} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{stats.commentCount}</div>
          <div style={{ color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>Comments</div>
        </div>
      </div>

      {/* Footer Actions */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        <button className="btn btn-primary" onClick={() => navigate('/bookmarks')} style={{ padding: '0.75rem 2rem' }}>
          <Bookmark size={18} /> My Saved Library
        </button>
        <button className="btn btn-outline" onClick={handleLogout} style={{ padding: '0.75rem 2rem', border: '1px solid var(--danger-color)', color: 'var(--danger-color)' }}>
          Logout Account
        </button>
      </div>

    </div>
  );
};

export default Profile;
