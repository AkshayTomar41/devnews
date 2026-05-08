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
        {/* Vote button */}
        <button
          className={`vote-btn ${voted ? 'voted' : ''}`}
          onClick={handleVote}
          disabled={voteLoading}
          title={voted ? 'Remove vote' : 'Upvote'}
        >
          <ArrowUp size={14} />
          <span>{localPoints}</span>
        </button>

        {/* Main content */}
        <div className="story-card-main">
          {story.type && story.type !== 'story' && (
            <span className={badgeClass}>{TYPE_LABELS[story.type]}</span>
          )}
          <a href={story.url} target="_blank" rel="noopener noreferrer" className="story-title">
            {story.title}
          </a>
          {story.domain && (
            <div className="story-domain">
              <ExternalLink size={11} style={{ verticalAlign: 'middle' }} /> {story.domain}
            </div>
          )}
          <div className="story-meta">
            <span className="story-meta-item">by <strong>{story.author}</strong></span>
            <span className="story-meta-item">{story.postedAt?.split(' ')[0] || ''}</span>
          </div>
        </div>

        {/* Bookmark button */}
        <button
          className={`bookmark-btn ${isBookmarked ? 'active' : ''}`}
          onClick={handleBookmark}
          disabled={bookmarkLoading}
          title={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
        >
          <Bookmark size={20} fill={isBookmarked ? 'var(--accent-color)' : 'none'} />
        </button>
      </div>

      {/* Footer */}
      <div className="story-card-footer">
        <Link to={`/story/${story._id}`} className="story-comment-link">
          <MessageCircle size={14} />
          {story.commentCount || 0} comment{story.commentCount !== 1 ? 's' : ''}
        </Link>
        <a href={story.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <ExternalLink size={12} /> Open story
        </a>
      </div>
    </div>
  );
};

export default StoryCard;
