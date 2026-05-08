import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import StoryCard from '../components/StoryCard';

const Bookmarks = () => {
  const [bookmarkedStories, setBookmarkedStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchBookmarks = async () => {
      try {
        setLoading(true);
        // We can fetch all stories and filter by user bookmarks, or create an endpoint for it.
        // Let's just fetch all and filter since it's a mini app, or better yet, fetch all stories and filter.
        const { data } = await axios.get('http://localhost:5000/api/stories?limit=1000');
        const filtered = data.stories.filter(story => user.bookmarks.includes(story._id));
        setBookmarkedStories(filtered);
      } catch (error) {
        console.error('Error fetching bookmarks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [user, navigate]);

  return (
    <div className="container py-4">
      <h2 className="mb-4">Your Bookmarks</h2>
      {loading ? (
        <div className="loader"></div>
      ) : bookmarkedStories.length === 0 ? (
        <div className="text-center text-secondary mt-4">
          <p>You haven't bookmarked any stories yet.</p>
        </div>
      ) : (
        bookmarkedStories.map(story => (
          <StoryCard key={story._id} story={story} />
        ))
      )}
    </div>
  );
};

export default Bookmarks;
