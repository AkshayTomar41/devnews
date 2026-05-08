import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import StoryCard from '../components/StoryCard';
import StorySkeleton from '../components/StorySkeleton';

const Bookmarks = () => {
  const [bookmarkedStories, setBookmarkedStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, updateBookmarks } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    const fetchBookmarks = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('http://localhost:5000/api/stories?limit=500');
        const ids = user.bookmarks?.map(id => id?.toString?.() || id) || [];
        const filtered = data.stories.filter(s => ids.includes(s._id?.toString()));
        setBookmarkedStories(filtered);
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    };
    fetchBookmarks();
  }, [user, navigate]);

  // Re-filter when user.bookmarks changes (after toggle)
  const ids = user?.bookmarks?.map(id => id?.toString?.() || id) || [];
  const visible = bookmarkedStories.filter(s => ids.includes(s._id?.toString()));

  return (
    <div className="container" style={{ paddingTop: '1.5rem', paddingBottom: '3rem' }}>
      <div className="page-header">
        <h2 className="page-title">My Bookmarks</h2>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          {visible.length} saved
        </span>
      </div>

      {loading ? (
        <StorySkeleton count={4} />
      ) : visible.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔖</div>
          <h3>No bookmarks yet</h3>
          <p>Click the bookmark icon on any story to save it here.</p>
        </div>
      ) : (
        <div className="stories-list">
          {visible.map((story, i) => (
            <div key={story._id} style={{ animationDelay: `${i * 0.05}s` }}>
              <StoryCard story={story} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
