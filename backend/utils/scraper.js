const axios = require('axios');
const cheerio = require('cheerio');
const Story = require('../models/Story');

const extractDomain = (url) => {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return '';
  }
};

const detectType = (title) => {
  if (title.startsWith('Ask HN')) return 'ask';
  if (title.startsWith('Show HN')) return 'show';
  if (title.toLowerCase().includes('hiring') || title.toLowerCase().includes('job')) return 'job';
  return 'story';
};

const scrapeHackerNews = async () => {
  try {
    const { data } = await axios.get('https://news.ycombinator.com', {
      headers: { 'User-Agent': 'Mozilla/5.0 HackerNewsClone/1.0' },
      timeout: 20000
    });
    const $ = cheerio.load(data);
    const stories = [];

    $('.athing').slice(0, 10).each((index, element) => {
      const el = $(element);
      const title = el.find('.titleline > a').text().trim();
      let url = el.find('.titleline > a').attr('href') || '';
      const hnId = el.attr('id');

      if (!title || !hnId) return;

      // If relative HN link
      if (url.startsWith('item?id=')) {
        url = `https://news.ycombinator.com/${url}`;
      }

      const subtext = el.next('.subtext');
      const pointsText = subtext.find('.score').text();
      const points = pointsText ? parseInt(pointsText.replace(' points', '')) || 0 : 0;
      const author = subtext.find('.hnuser').text() || 'anonymous';
      const postedAt = subtext.find('.age').attr('title') || subtext.find('.age').text() || 'just now';

      stories.push({
        title: title || 'Untitled Story',
        url,
        points,
        author,
        postedAt,
        hnId,
        domain: extractDomain(url),
        type: detectType(title)
      });
    });

    // Upsert into database
    for (const story of stories) {
      await Story.findOneAndUpdate(
        { hnId: story.hnId },
        { $setOnInsert: { votes: [], commentCount: 0 }, ...story },
        { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
      );
    }

    console.log(`[Scraper] Scraped ${stories.length} stories at ${new Date().toLocaleTimeString()}`);
    return stories;
  } catch (error) {
    console.error('[Scraper] Error:', error.message);
    throw error;
  }
};

module.exports = { scrapeHackerNews };
