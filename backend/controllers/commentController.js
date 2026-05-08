const Comment = require('../models/Comment');
const Story = require('../models/Story');

// @desc    Get all comments for a story
// @route   GET /api/stories/:id/comments
// @access  Public
const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ story: req.params.id })
      .populate('user', 'username avatarColor')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a comment to a story
// @route   POST /api/stories/:id/comments
// @access  Private
const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    const comment = await Comment.create({
      story: req.params.id,
      user: req.user._id,
      text: text.trim()
    });

    // Increment comment count
    story.commentCount = (story.commentCount || 0) + 1;
    await story.save();

    const populated = await comment.populate('user', 'username avatarColor');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    // Decrement comment count
    await Story.findByIdAndUpdate(comment.story, { $inc: { commentCount: -1 } });
    await comment.deleteOne();

    res.json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getComments, addComment, deleteComment };
