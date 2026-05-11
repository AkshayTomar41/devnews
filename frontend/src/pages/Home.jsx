import React, { useState, useEffect, useCallback, useContext } from 'react';
import axios from 'axios';
import StoryCard from '../components/StoryCard';
import StorySkeleton from '../components/StorySkeleton';
import { ToastContext } from '../context/ToastContext';
import { Search, RefreshCw, BarChart2, Users, MessageCircle, Star } from 'lucide-react';

const useDebounce = (value, delay) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
};

const Home = () => {
  const { addToast } = useContext(ToastContext);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scraping, setScraping] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('points');
  const [typeFilter, setTypeFilter] = useState('all');
  const [stats, setStats] = useState(null);

  const debouncedSearch = useDebounce(search, 400);

  const fetchStats = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/stories/stats`);
      setStats(data);
    } catch { /* ignore */ }
  };

  const fetchStories = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: p, limit: 10, sort, type: typeFilter });
      if (debouncedSearch) params.append('q', debouncedSearch);
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/stories?${params}`);
      setStories(data.stories);
      setTotalPages(data.pages);
      setPage(data.page);
      setTotal(data.total);
    } catch {
      addToast('Failed to fetch stories', 'error');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, sort, typeFilter, addToast]);

  useEffect(() => { fetchStories(1); }, [fetchStories]);
  useEffect(() => { fetchStats(); }, []);

  const handleScrape = async () => {
    setScraping(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/scrape`);
      addToast('✅ Stories refreshed from HackerNews!', 'success');
      await fetchStories(1);
      await fetchStats();
    } catch {
      addToast('Scrape failed. Try again.', 'error');
    } finally {
      setScraping(false);
    }
  };

  const handleVoteUpdate = (storyId, newPoints) => {
    setStories(prev => prev.map(s => s._id === storyId ? { ...s, points: newPoints } : s));
  };

  return (
    <div className="container" style={{ paddingTop: '1.5rem', paddingBottom: '3rem' }}>
      {/* Stats bar */}
      {stats && (
        <div className="stats-bar">
          <div className="stat-chip"><BarChart2 size={13} /> <strong>{stats.storyCount}</strong> stories</div>
          <div className="stat-chip"><Users size={13} /> <strong>{stats.userCount}</strong> users</div>
          <div className="stat-chip"><MessageCircle size={13} /> <strong>{stats.commentCount}</strong> comments</div>
          {stats.topStory && (
            <div className="stat-chip"><Star size={13} /> Top: <strong style={{ maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{stats.topStory.title}</strong></div>
          )}
        </div>
      )}

      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', letterSpacing: '-0.04em', marginBottom: '0.25rem' }}>Top Stories</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Curated tech news from around the web</p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={handleScrape} 
          disabled={scraping || loading}
          style={{ padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)' }}
        >
          <RefreshCw size={18} className={scraping ? 'spin' : ''} />
          {scraping ? 'Refreshing...' : 'Refresh Feed'}
        </button>
      </div>

      {/* Search + Filters */}
      <div className="search-filter-bar">
        <div className="search-wrapper">
          <Search size={15} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search stories, authors..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select className="filter-select" value={sort} onChange={e => setSort(e.target.value)}>
          <option value="points">Top Points</option>
          <option value="newest">Newest</option>
          <option value="comments">Most Comments</option>
        </select>
        <select className="filter-select" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          <option value="all">All Types</option>
          <option value="story">Story</option>
          <option value="ask">Ask HN</option>
          <option value="show">Show HN</option>
          <option value="job">Job</option>
        </select>
      </div>

      {/* Stories */}
      {loading ? (
        <StorySkeleton count={6} />
      ) : stories.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <h3>No stories found</h3>
          <p>Try a different search term or filter</p>
        </div>
      ) : (
        <div className="stories-list">
          {stories.map((story, i) => (
            <div key={story._id} style={{ animationDelay: `${i * 0.05}s` }}>
              <StoryCard story={story} onVoteUpdate={handleVoteUpdate} />
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && !loading && (
        <div className="pagination">
          <button className="page-btn" disabled={page === 1} onClick={() => fetchStories(page - 1)}>
            ← Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              className={`page-btn ${p === page ? 'active' : ''}`}
              onClick={() => fetchStories(p)}
            >
              {p}
            </button>
          ))}
          <button className="page-btn" disabled={page === totalPages} onClick={() => fetchStories(page + 1)}>
            Next →
          </button>
        </div>
      )}

      {!loading && (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.5rem' }}>
          Showing {stories.length} of {total} stories
        </p>
      )}
    </div>
  );
};

export default Home;
