const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  points: {
    type: Number,
    required: true,
    default: 0
  },
  author: {
    type: String,
    default: 'anonymous'
  },
  postedAt: {
    type: String,
    default: 'just now'
  },
  hnId: {
    type: String,
    required: true,
    unique: true
  },
  votes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  commentCount: {
    type: Number,
    default: 0
  },
  domain: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    enum: ['story', 'ask', 'show', 'job'],
    default: 'story'
  }
}, { timestamps: true });

const Story = mongoose.model('Story', storySchema);
module.exports = Story;

