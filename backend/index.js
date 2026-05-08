const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const cron = require('node-cron');
const connectDB = require('./config/db');
const { scrapeHackerNews } = require('./utils/scraper');

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiter — max 100 requests per 15 min
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/stories', require('./routes/storyRoutes'));
app.use('/api/scrape', require('./routes/scrapeRoutes'));
app.use('/api/comments', require('./routes/commentRoutes'));

// Global error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`✅ Server running on port ${PORT}`);

  // Auto-scrape on startup
  try {
    console.log('🕷️  Running initial scrape...');
    await scrapeHackerNews();
  } catch (error) {
    console.error('❌ Initial scrape failed:', error.message);
  }

  // Cron: auto-scrape every hour
  cron.schedule('0 * * * *', async () => {
    console.log('⏰ Cron: running scheduled scrape...');
    try {
      await scrapeHackerNews();
    } catch (error) {
      console.error('❌ Scheduled scrape failed:', error.message);
    }
  });

  console.log('⏰ Cron job scheduled — scraping every hour');
});
