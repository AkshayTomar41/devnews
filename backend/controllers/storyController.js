const Story = require('../models/Story');
const User = require('../models/User');

// @desc    Fetch all stories (sorted, paginated, filterable)
// @route   GET /api/stories?page=1&limit=10&sort=points&q=search
// @access  Public
const getStories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const sort = req.query.sort || 'points';
    const q = req.query.q || '';
    const type = req.query.type || '';

    const query = {};
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { author: { $regex: q, $options: 'i' } }
      ];
    }
    if (type && type !== 'all') {
      query.type = type;
    }

    const sortOptions = {
      points: { points: -1 },
      newest: { createdAt: -1 },
      comments: { commentCount: -1 }
    };

    const stories = await Story.find(query)
      .sort(sortOptions[sort] || { points: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Story.countDocuments(query);

    res.json({
      stories,
      page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch a single story
// @route   GET /api/stories/:id
// @access  Public
const getStoryById = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (story) {
      res.json(story);
    } else {
      res.status(404).json({ message: 'Story not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle bookmark
// @route   POST /api/stories/:id/bookmark
// @access  Private
const toggleBookmark = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const storyId = req.params.id;
    console.log(`Toggling bookmark for user ${user?.username} and story ${storyId}`);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.bookmarks) {
      user.bookmarks = [];
    }

    const isBookmarked = user.bookmarks.some(id => id && id.toString() === storyId.toString());

    if (isBookmarked) {
      user.bookmarks = user.bookmarks.filter(
        (id) => id && id.toString() !== storyId.toString()
      );
    } else {
      user.bookmarks.push(storyId);
    }

    await user.save();
    res.json({ bookmarkedIds: user.bookmarks, isBookmarked: !isBookmarked });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle vote on a story
// @route   POST /api/stories/:id/vote
// @access  Private
const toggleVote = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    const userId = req.user._id.toString();
    const hasVoted = story.votes.map(id => id.toString()).includes(userId);

    if (hasVoted) {
      story.votes = story.votes.filter(id => id.toString() !== userId);
      story.points = Math.max(0, story.points - 1);
    } else {
      story.votes.push(req.user._id);
      story.points += 1;
    }

    await story.save();
    res.json({ points: story.points, voted: !hasVoted });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get site-wide stats
// @route   GET /api/stories/stats
// @access  Public
const getSiteStats = async (req, res) => {
  try {
    const storyCount = await Story.countDocuments();
    const topStory = await Story.findOne().sort({ points: -1 });
    const User = require('../models/User');
    const userCount = await User.countDocuments();
    const Comment = require('../models/Comment');
    const commentCount = await Comment.countDocuments();

    res.json({ storyCount, userCount, commentCount, topStory });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getStories,
  getStoryById,
  toggleBookmark,
  toggleVote,
  getSiteStats
};
