const Story = require('../models/Story');
const User = require('../models/User');

// @desc    Fetch all stories (sorted by points descending, with pagination)
// @route   GET /api/stories
// @access  Public
const getStories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const stories = await Story.find()
      .sort({ points: -1 })
      .skip(skip)
      .limit(limit);
      
    const total = await Story.countDocuments();

    res.json({
      stories,
      page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
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

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isBookmarked = user.bookmarks.includes(storyId);

    if (isBookmarked) {
      // Remove bookmark
      user.bookmarks = user.bookmarks.filter(
        (id) => id.toString() !== storyId.toString()
      );
    } else {
      // Add bookmark
      user.bookmarks.push(storyId);
    }

    await user.save();
    
    // Return updated bookmarks
    // We populate to optionally send back story details, but IDs are usually enough
    // Let's populate so the frontend has the latest list of bookmarked stories
    const updatedUser = await User.findById(req.user._id).populate('bookmarks');

    res.json({ bookmarks: updatedUser.bookmarks, bookmarkedIds: user.bookmarks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getStories,
  getStoryById,
  toggleBookmark,
};
