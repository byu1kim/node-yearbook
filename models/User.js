const mongoose = require("mongoose");
const passportLocalmongoose = require("passport-local-mongoose");

const commentSchema = mongoose.Schema({
  userid: {
    type: String,
    index: true,
  },
  photoPath: {
    type: String,
  },
  commenter: {
    type: String,
  },
  comment: {
    type: String,
  },
});

// User Schema
const userSchema = mongoose.Schema({
  username: {
    type: String,
    index: true,
  },
  email: {
    type: String,
    index: true,
  },
  password: {
    type: String,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  interests: {
    type: Array,
  },
  photoPath: {
    type: String,
  },
  roles: {
    type: Array,
  },
  comments: {
    type: [commentSchema],
    default: {},
  },
});

userSchema.plugin(passportLocalmongoose);

const User = mongoose.model("User", userSchema);

module.exports = User;
