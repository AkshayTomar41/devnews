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

const getInitial = (name) => name?.[0]?.toUpperCase() || '?';

const Profile = () => {
  const { user, login, logout } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const navigate = useNavigate();

  const [stats, setStats] = useState({ bookmarkCount: 0, commentCount: 0 });
  const [bio, setBio] = useState('');
  const [avatarColor, setAvatarColor] = useState('#3b82f6');
  const [editingBio, setEditingBio] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    setBio(user.bio || '');
    setAvatarColor(user.avatarColor || '#3b82f6');

    // Fetch stats
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
        { bio, avatarColor },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      // Update context
      login({ ...user, bio: data.bio, avatarColor: data.avatarColor });
      setEditingBio(false);
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
    <div className="container" style={{ paddingTop: '1.5rem', paddingBottom: '3rem', maxWidth: 600 }}>
      <h2 className="page-title" style={{ marginBottom: '1.5rem' }}>My Profile</h2>

      {/* Avatar & name */}
      <div className="profile-card">
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div className="profile-avatar" style={{ background: avatarColor }}>
            {getInitial(user.username)}
          </div>
          <div style={{ flex: 1 }}>
            <div className="profile-username">{user.username}</div>

            {/* Bio */}
            {editingBio ? (
              <div style={{ marginTop: '0.75rem' }}>
                <textarea
                  className="form-input"
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  rows={2}
                  placeholder="Tell something about yourself..."
                  maxLength={200}
                />
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button className="btn btn-primary btn-sm" onClick={handleSaveProfile} disabled={saving}>
                    <Check size={13} /> {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button className="btn btn-outline btn-sm" onClick={() => { setEditingBio(false); setBio(user.bio || ''); setAvatarColor(user.avatarColor || '#3b82f6'); }}>
                    <X size={13} /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ marginTop: '0.5rem' }}>
                <p className="profile-bio">{bio || 'No bio yet.'}</p>
                <button className="btn btn-outline btn-sm" onClick={() => setEditingBio(true)}>
                  <Edit3 size={13} /> Edit Profile
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Avatar color picker */}
        {editingBio && (
          <div style={{ marginTop: '1rem' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Avatar color</p>
            <div className="color-picker-row">
              {AVATAR_COLORS.map(c => (
                <div
                  key={c}
                  className={`color-dot ${avatarColor === c ? 'selected' : ''}`}
                  style={{ background: c }}
                  onClick={() => setAvatarColor(c)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="profile-card" style={{ display: 'flex', justifyContent: 'space-around' }}>
        <div className="profile-stat">
          <div className="profile-stat-value">{stats.bookmarkCount}</div>
          <div className="profile-stat-label" style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'center' }}>
            <Bookmark size={12} /> Bookmarks
          </div>
        </div>
        <div style={{ width: 1, background: 'var(--border-color)' }} />
        <div className="profile-stat">
          <div className="profile-stat-value">{stats.commentCount}</div>
          <div className="profile-stat-label" style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'center' }}>
            <MessageCircle size={12} /> Comments
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1rem' }}>
        <button className="btn btn-outline" onClick={() => navigate('/bookmarks')}>
          <Bookmark size={15} /> My Bookmarks
        </button>
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
