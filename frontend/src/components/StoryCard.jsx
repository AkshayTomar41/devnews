import React, { useContext, useState } from 'react';
import { Bookmark } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const StoryCard = ({ story }) => {
  const { user, updateBookmarks } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const isBookmarked = user?.bookmarks?.includes(story._id);

  const handleBookmark = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    
    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `http://localhost:5000/api/stories/${story._id}/bookmark`,
        {},
        config
      );
      updateBookmarks(data.bookmarkedIds);
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="story-card">
      <div>
        <a href={story.url} target="_blank" rel="noopener noreferrer" className="story-title" style={{ display: 'block' }}>
          {story.title}
        </a>
        <div className="story-meta">
          <span>{story.points} points</span>
          <span>•</span>
          <span>by {story.author}</span>
          <span>•</span>
          <span>{story.postedAt}</span>
        </div>
      </div>
      <button 
        className={`bookmark-btn ${isBookmarked ? 'active' : ''}`} 
        onClick={handleBookmark}
        disabled={loading}
        title={isBookmarked ? "Remove bookmark" : "Add bookmark"}
      >
        <Bookmark 
          size={24} 
          fill={isBookmarked ? "#f59e0b" : "none"} 
          color={isBookmarked ? "#f59e0b" : "currentColor"} 
        />
      </button>
    </div>
  );
};

export default StoryCard;
