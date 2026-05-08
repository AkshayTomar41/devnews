const { scrapeHackerNews } = require('../utils/scraper');

// @desc    Trigger scrape manually
// @route   POST /api/scrape
// @access  Public
const triggerScrape = async (req, res) => {
  try {
    const stories = await scrapeHackerNews();
    res.json({ message: 'Scrape successful', stories });
  } catch (error) {
    res.status(500).json({ message: 'Scrape failed', error: error.message });
  }
};

module.exports = { triggerScrape };
