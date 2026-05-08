const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { scrapeHackerNews } = require('./utils/scraper');

// Load env vars
dotenv.config();

// Connect to DB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/stories', require('./routes/storyRoutes'));
app.use('/api/scrape', require('./routes/scrapeRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  
  // Scraper should run automatically on server start
  try {
    console.log('Running initial scrape...');
    await scrapeHackerNews();
    console.log('Initial scrape completed.');
  } catch (error) {
    console.error('Initial scrape failed:', error.message);
  }
});
