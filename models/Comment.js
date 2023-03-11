const mongoose = require("mongoose");

// Comment Schema
const commentSchema = mongoose.Schema({
  comment: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, required: true, default: Date.now },
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
