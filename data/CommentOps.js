const User = require("../models/User");

class CommentOps {
  // Constructor
  CommentOps() {}

  async addComment(profileUser, comment) {
    profileUser.comments.push(comment);
    let finalUser = await profileUser.save();
    return finalUser;
  }

  async updateComment(profileUser, comment) {
    const comments = profileUser.comments;
    try {
      for (let i = 0; i < comments.length; i++) {
        if (comments[i].id == comment.commentid) {
          comments[i].comment = comment.comment;
          let updatedUser = await profileUser.save();
        }
      }
      return "S";
    } catch (e) {
      return e;
    }
  }

  async deleteComment(profileUser, commentid) {
    const comments = profileUser.comments;
    try {
      for (let i = 0; i < comments.length; i++) {
        if (comments[i].id == commentid) {
          comments.splice(i, 1);
          profileUser.save();
        }
      }
      return "S";
    } catch (e) {
      return e;
    }
  }
}

module.exports = CommentOps;
