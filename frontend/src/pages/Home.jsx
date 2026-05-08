import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StoryCard from '../components/StoryCard';

const Home = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchStories = async (pageNumber) => {
    try {
      setLoading(true);
      const { data } = await axios.get(`http://localhost:5000/api/stories?page=${pageNumber}&limit=10`);
      setStories(data.stories);
      setTotalPages(data.pages);
      setPage(data.page);
    } catch (error) {
      console.error('Error fetching stories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories(1);
  }, []);

  const handleTriggerScrape = async () => {
    try {
      setLoading(true);
      await axios.post('http://localhost:5000/api/scrape');
      await fetchStories(1);
    } catch (error) {
      console.error('Error scraping:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Top Stories</h2>
        <button className="btn btn-primary" onClick={handleTriggerScrape} disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh Latest'}
        </button>
      </div>

      {loading ? (
        <div className="loader"></div>
      ) : (
        <>
          {stories.map(story => (
            <StoryCard key={story._id} story={story} />
          ))}
          
          {totalPages > 1 && (
            <div className="pagination">
              <button 
                className="page-item" 
                disabled={page === 1}
                onClick={() => fetchStories(page - 1)}
              >
                Previous
              </button>
              <span className="page-item active">{page} of {totalPages}</span>
              <button 
                className="page-item" 
                disabled={page === totalPages}
                onClick={() => fetchStories(page + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
