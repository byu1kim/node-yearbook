const mongoose = require("mongoose");
const passportLocalmongoose = require("passport-local-mongoose");

const { commentSchema } = require("./Comment");

// User Schema
const userSchema = mongoose.Schema({
  username: { type: String, index: true },
  email: { type: String, index: true },
  password: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  interests: { type: Array },
  photoPath: { type: String },
  roles: { type: Array },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
});

userSchema.plugin(passportLocalmongoose);

const User = mongoose.model("User", userSchema);

module.exports = User;
