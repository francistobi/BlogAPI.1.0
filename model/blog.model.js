const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    default: "draft",
  },
  read_count: {
    type: Number,
    required: true,
    default: 1,
  },
  reading_time: {
    type: Number,
    required: true,
    default: 1,
  },
  tags: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
    trim: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});


module.exports = mongoose.model("blogs", blogSchema);