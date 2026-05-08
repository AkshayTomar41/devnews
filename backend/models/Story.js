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
    required: true
  },
  postedAt: {
    type: String,
    required: true
  },
  hnId: {
    type: String,
    required: true,
    unique: true
  }
}, { timestamps: true });

const Story = mongoose.model('Story', storySchema);
module.exports = Story;
