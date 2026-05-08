const axios = require('axios');
const cheerio = require('cheerio');
const Story = require('../models/Story');

const scrapeHackerNews = async () => {
  try {
    const { data } = await axios.get('https://news.ycombinator.com');
    const $ = cheerio.load(data);
    const stories = [];

    $('.athing').slice(0, 10).each((index, element) => {
      const el = $(element);
      const title = el.find('.titleline > a').text();
      let url = el.find('.titleline > a').attr('href');
      const hnId = el.attr('id');

      // If the url is a relative HN link
      if (url.startsWith('item?id=')) {
        url = `https://news.ycombinator.com/${url}`;
      }

      // Next sibling contains the metadata
      const subtext = el.next('.subtext');
      const pointsText = subtext.find('.score').text();
      const points = pointsText ? parseInt(pointsText.replace(' points', '')) : 0;
      const author = subtext.find('.hnuser').text() || 'anonymous';
      const postedAt = subtext.find('.age').attr('title') || subtext.find('.age').text();

      stories.push({
        title,
        url,
        points,
        author,
        postedAt,
        hnId
      });
    });

    // Save to database
    for (const story of stories) {
      await Story.findOneAndUpdate(
        { hnId: story.hnId },
        story,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }
    
    return stories;
  } catch (error) {
    console.error('Error scraping Hacker News:', error.message);
    throw error;
  }
};

module.exports = { scrapeHackerNews };
