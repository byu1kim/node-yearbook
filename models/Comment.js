const mongoose = require("mongoose");
const passportLocalmongoose = require("passport-local-mongoose");

// Comment Schema
const commentSchema = mongoose.Schema({
  userid: {
    type: String,
    index: true,
  },
  comment: {
    type: String,
  },
});

commentSchema.plugin(passportLocalmongoose);

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
