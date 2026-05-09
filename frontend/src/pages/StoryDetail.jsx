import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';
import { ArrowLeft, ExternalLink, MessageCircle, Trash2, ArrowUp } from 'lucide-react';

const getInitial = (name) => name?.[0]?.toUpperCase() || '?';

const StoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);

  const [story, setStory] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [storyRes, commentsRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/stories/${id}`),
          axios.get(`http://localhost:5000/api/stories/${id}/comments`)
        ]);
        setStory(storyRes.data);
        setComments(commentsRes.data);
      } catch {
        addToast('Story not found', 'error');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    if (!commentText.trim()) return;
    setSubmitting(true);
    try {
      const { data } = await axios.post(
        `http://localhost:5000/api/stories/${id}/comments`,
        { text: commentText },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setComments(prev => [data, ...prev]);
      setStory(prev => ({ ...prev, commentCount: (prev.commentCount || 0) + 1 }));
      setCommentText('');
      addToast('💬 Comment posted!', 'success');
    } catch {
      addToast('Failed to post comment', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`http://localhost:5000/api/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setComments(prev => prev.filter(c => c._id !== commentId));
      setStory(prev => ({ ...prev, commentCount: Math.max(0, (prev.commentCount || 1) - 1) }));
      addToast('Comment deleted', 'info');
    } catch {
      addToast('Failed to delete comment', 'error');
    }
  };

  const formatTime = (ts) => {
    if (!ts) return '';
    const d = new Date(ts);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  if (loading) return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <div style={{ background: 'var(--surface-color)', borderRadius: 16, padding: '2rem', border: '1px solid var(--border-color)' }}>
        <div className="skeleton skeleton-line" style={{ width: '65%', height: 24, marginBottom: 16 }} />
        <div className="skeleton skeleton-line" style={{ width: '40%', height: 14, marginBottom: 8 }} />
        <div className="skeleton skeleton-line" style={{ width: '30%', height: 14 }} />
      </div>
    </div>
  );

  if (!story) return null;

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem', maxWidth: '900px' }}>
      <button className="back-btn" onClick={() => navigate(-1)} style={{ marginBottom: '1.5rem', fontWeight: 600 }}>
        <ArrowLeft size={18} /> Back to stories
      </button>

      {/* Story detail hero section */}
      <div className="story-detail-container" style={{ padding: '3.5rem', marginBottom: '3rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          {story.type && (
            <span className={`story-type-badge badge-${story.type}`} style={{ marginBottom: '1rem', fontSize: '0.8rem', padding: '0.35rem 1rem' }}>
              {story.type.toUpperCase()}
            </span>
          )}
          <h1 style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.04em', marginBottom: '1.5rem' }}>
            {story.title}
          </h1>
        </div>

        <div className="story-detail-meta" style={{ marginBottom: '2.5rem', fontSize: '1rem' }}>
          <div className="stat-chip" style={{ background: 'var(--primary-glow)', color: 'var(--primary-color)', border: 'none' }}>
            <ArrowUp size={16} strokeWidth={3} /> <strong>{story.points} Points</strong>
          </div>
          <div className="stat-chip">
            by <strong style={{ color: 'var(--text-primary)' }}>{story.author}</strong>
          </div>
          <div className="stat-chip">
            {story.postedAt}
          </div>
          {story.domain && (
            <div className="stat-chip" style={{ color: 'var(--text-muted)' }}>
              via {story.domain}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <a href={story.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ padding: '0.75rem 2rem', borderRadius: 'var(--radius-md)' }}>
            <ExternalLink size={18} /> Open Source Material
          </a>
          <div className="btn btn-outline" style={{ padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)', cursor: 'default' }}>
            <MessageCircle size={18} /> {story.commentCount || 0} Discussions
          </div>
        </div>
      </div>

      {/* Comments section */}
      <div className="comments-section">
        <h3>{comments.length} Comment{comments.length !== 1 ? 's' : ''}</h3>

        {/* Comment form */}
        {user ? (
          <form onSubmit={handleAddComment} className="comment-form">
            <div
              className="comment-avatar-sm"
              style={{ background: user.avatarColor || 'var(--primary-color)' }}
            >
              {getInitial(user.username)}
            </div>
            <div className="comment-form-inner">
              <textarea
                className="form-input"
                placeholder="Share your thoughts..."
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                rows={2}
                required
              />
              <div className="comment-form-actions">
                <button type="submit" className="btn btn-primary btn-sm" disabled={submitting || !commentText.trim()}>
                  {submitting ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div style={{ background: 'var(--surface-color)', borderRadius: 10, padding: '1rem', textAlign: 'center', marginBottom: '1.5rem', border: '1px solid var(--border-color)' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              <a href="/login">Login</a> to join the discussion
            </span>
          </div>
        )}

        {/* Comment list */}
        {comments.length === 0 ? (
          <div className="empty-state" style={{ padding: '2rem' }}>
            <div className="empty-state-icon">💬</div>
            <h3>No comments yet</h3>
            <p>Be the first to share your thoughts!</p>
          </div>
        ) : (
          comments.map(comment => (
            <div className="comment-item" key={comment._id}>
              <div
                className="comment-avatar-sm"
                style={{ background: comment.user?.avatarColor || 'var(--primary-color)' }}
              >
                {getInitial(comment.user?.username)}
              </div>
              <div className="comment-body">
                <div className="comment-header">
                  <span className="comment-username">{comment.user?.username}</span>
                  <span className="comment-time">{formatTime(comment.createdAt)}</span>
                  {user && user._id === comment.user?._id && (
                    <button
                      className="btn-icon btn-sm comment-delete-btn"
                      onClick={() => handleDeleteComment(comment._id)}
                      title="Delete comment"
                      style={{ color: 'var(--danger-color)', marginLeft: 'auto' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <p className="comment-text">{comment.text}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StoryDetail;
