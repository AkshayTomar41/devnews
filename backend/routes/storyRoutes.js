const express = require('express');
const router = express.Router();
const { getStories, getStoryById, toggleBookmark, toggleVote, getSiteStats } = require('../controllers/storyController');
const { getComments, addComment } = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

router.get('/stats', getSiteStats);
router.get('/', getStories);
router.get('/:id', getStoryById);
router.post('/:id/bookmark', protect, toggleBookmark);
router.post('/:id/vote', protect, toggleVote);
router.get('/:id/comments', getComments);
router.post('/:id/comments', protect, addComment);

module.exports = router;
