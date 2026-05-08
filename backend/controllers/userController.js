const User = require('../models/User');
const Story = require('../models/Story');
const Comment = require('../models/Comment');

// @desc    Get current user's profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('bookmarks');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile (bio, avatarColor)
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { bio, avatarColor } = req.body;
    const user = await User.findById(req.user._id);

    if (bio !== undefined) user.bio = bio;
    if (avatarColor !== undefined) user.avatarColor = avatarColor;

    await user.save();
    
    res.json({
      _id: user._id,
      username: user.username,
      bio: user.bio,
      avatarColor: user.avatarColor,
      bookmarks: user.bookmarks
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user stats (bookmark count, comment count)
// @route   GET /api/auth/stats
// @access  Private
const getUserStats = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const commentCount = await Comment.countDocuments({ user: req.user._id });
    const bookmarkCount = user.bookmarks.length;

    res.json({ commentCount, bookmarkCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProfile, updateProfile, getUserStats };
