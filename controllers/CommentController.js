const RequestService = require("../services/RequestService");
const UserOps = require("../data/UserOps");
const CommentOps = require("../data/CommentOps");
const _userOps = new UserOps();
const _commentOps = new CommentOps();

// POST comment
exports.AddComment = async (req, res) => {
  let reqInfo = RequestService.reqHelper(req);

  let profileUserId;
  if (req.params.id) {
    profileUserId = req.params.id;
  } else {
    profileUserId = reqInfo.id;
  }

  let profileUser = await _userOps.getUserById(profileUserId);
  let commentUser = await _userOps.getUserById(reqInfo.id);

  const comment = {
    comment: req.body.comment,
    user: commentUser,
  };

  await _commentOps.addComment(profileUser, comment);

  if (req.params.id) {
    res.redirect(`/profile/${profileUserId}`);
  } else {
    res.redirect("/profile");
  }
};

// GET Comment Edit
exports.EditComment = async (req, res) => {
  let reqInfo = RequestService.reqHelper(req);
  let profileUser = await _userOps.getUserById(req.params.id);
  res.render("user/profile", {
    editid: req.params.commentid,
    reqInfo: reqInfo,
    user: profileUser,
    errorMessage: "",
  });
};

// POST Comment Edit
exports.EditCommentPost = async (req, res) => {
  console.log("⭐️ Edit Post");
  let reqInfo = RequestService.reqHelper(req);
  let profileUser = await _userOps.getUserById(req.body.userid);

  const newComment = {
    id: req.body.commentid,
    comment: req.body.comment,
  };
  let updatedUser = await _commentOps.updateComment(newComment);
  if ((updatedUser = "S")) {
    res.redirect(`/profile/${req.body.userid}`);
  } else {
    res.render("user/profile", {
      editid: req.params.commentid,
      reqInfo: reqInfo,
      user: profileUser,
      errorMessage: updatedUser,
    });
  }
};

// POST Delete
exports.DeleteComment = async (req, res) => {
  let reqInfo = RequestService.reqHelper(req);
  const commentid = req.params.commentid;
  let deletedUser = await _commentOps.deleteComment(commentid);
  if ((deletedUser = "S")) {
    res.redirect(`/profile/${req.params.id}`);
  } else {
    res.render("user/profile", {
      editid: false,
      reqInfo: reqInfo,
      user: profileUser,
      errorMessage: "",
    });
  }
};
