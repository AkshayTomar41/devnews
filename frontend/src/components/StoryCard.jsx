import React, { useContext, useState } from 'react';
import { Bookmark, MessageCircle, ArrowUp, ExternalLink } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';
import { useNavigate, Link } from 'react-router-dom';

const TYPE_LABELS = { ask: 'Ask HN', show: 'Show HN', job: 'Job', story: 'Story' };

const StoryCard = ({ story, onVoteUpdate }) => {
  const { user, updateBookmarks } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const navigate = useNavigate();
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [voteLoading, setVoteLoading] = useState(false);
  const [localPoints, setLocalPoints] = useState(story.points);
  const [voted, setVoted] = useState(user?.votedStories?.includes(story._id) ?? false);

  const isBookmarked = user?.bookmarks?.map?.(id =>
    typeof id === 'object' ? id._id || id.toString() : id.toString()
  ).includes(story._id?.toString());

  const authConfig = () => ({
    headers: { Authorization: `Bearer ${user.token}` },
  });

  const handleBookmark = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    setBookmarkLoading(true);
    try {
      const { data } = await axios.post(
        `http://localhost:5000/api/stories/${story._id}/bookmark`, {}, authConfig()
      );
      updateBookmarks(data.bookmarkedIds);
      addToast(data.isBookmarked ? '📌 Story bookmarked!' : 'Bookmark removed', data.isBookmarked ? 'success' : 'info');
    } catch {
      addToast('Failed to update bookmark', 'error');
    } finally {
      setBookmarkLoading(false);
    }
  };

  const handleVote = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    setVoteLoading(true);
    try {
      const { data } = await axios.post(
        `http://localhost:5000/api/stories/${story._id}/vote`, {}, authConfig()
      );
      setLocalPoints(data.points);
      setVoted(data.voted);
      addToast(data.voted ? '👍 Upvoted!' : 'Vote removed', 'success');
      if (onVoteUpdate) onVoteUpdate(story._id, data.points);
    } catch {
      addToast('Failed to vote', 'error');
    } finally {
      setVoteLoading(false);
    }
  };

  const badgeClass = `story-type-badge badge-${story.type || 'story'}`;

  return (
    <div className="story-card">
      <div className="story-card-header">
        {/* Left Side: Vote Section */}
        <div className="vote-section">
          <button
            className={`vote-btn ${voted ? 'voted' : ''}`}
            onClick={handleVote}
            disabled={voteLoading}
            title={voted ? 'Remove vote' : 'Upvote'}
          >
            <ArrowUp size={18} strokeWidth={3} />
          </button>
          <span className="vote-count">{localPoints}</span>
        </div>

        {/* Middle: Content Section */}
        <div className="story-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
            {story.type && (
              <span className={badgeClass}>{TYPE_LABELS[story.type]}</span>
            )}
            {story.domain && (
              <span className="story-domain" style={{ margin: 0 }}>
                {story.domain}
              </span>
            )}
          </div>
          
          <a href={story.url} target="_blank" rel="noopener noreferrer" className="story-title">
            {story.title}
          </a>

          <div className="story-meta">
            <span className="meta-item">
              by <strong style={{ color: 'var(--text-primary)' }}>{story.author}</strong>
            </span>
            <span className="meta-item">
              {story.postedAt?.split(' ')[0] || ''}
            </span>
            <Link to={`/story/${story._id}`} className="meta-item" style={{ color: 'var(--primary-color)', fontWeight: 600 }}>
              <MessageCircle size={14} />
              {story.commentCount || 0}
            </Link>
          </div>
        </div>

        {/* Right Side: Action Section */}
        <div className="story-card-actions-top">
          <button
            className={`btn-icon ${isBookmarked ? 'active' : ''}`}
            onClick={handleBookmark}
            disabled={bookmarkLoading}
            title={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
            style={{ border: 'none', color: isBookmarked ? 'var(--accent-color)' : 'var(--text-muted)' }}
          >
            <Bookmark size={20} fill={isBookmarked ? 'var(--accent-color)' : 'none'} />
          </button>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="story-card-actions">
        <a 
          href={story.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="btn btn-outline btn-sm"
          style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem' }}
        >
          <ExternalLink size={12} /> View Source
        </a>
        <Link 
          to={`/story/${story._id}`} 
          className="btn btn-primary btn-sm"
          style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem' }}
        >
          Discuss
        </Link>
      </div>
    </div>
  );
};

export default StoryCard;
