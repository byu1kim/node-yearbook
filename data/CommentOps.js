const User = require("../models/User");
const Comment = require("../models/Comment");

class CommentOps {
  CommentOps() {}

  async addComment(profileUser, comment) {
    const newComment = await Comment.create(comment);
    profileUser.comments.push(newComment);
    let newProfileUser = await profileUser.save();
    return newProfileUser;
  }

  async updateComment(newComment) {
    try {
      let oldComment = await Comment.findById(newComment.id);
      oldComment.comment = newComment.comment;
      await oldComment.save();
      return "S";
    } catch (e) {
      return e;
    }
  }

  async deleteComment(id) {
    try {
      let deletedComment = await Comment.findByIdAndDelete(id);
      return "S";
    } catch (e) {
      return e;
    }
  }
}

module.exports = CommentOps;
