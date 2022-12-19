const RequestService = require("../services/RequestService");
const UserOps = require("../data/UserOps");
const _userOps = new UserOps();

const CommentOps = require("../data/CommentOps");
const _commentOps = new CommentOps();

//나중에 ops로 옮기기
const User = require("../models/User");

exports.AddComment = async (req, res) => {
  let reqInfo = RequestService.reqHelper(req);

  let profileUser = await _userOps.getUserById(req.body.userid);
  let commentUser = await _userOps.getUserById(req.body.commenterid);

  const comment = {
    userid: req.body.commenterid,
    photoPath: req.body.photoPath,
    commenter: `${commentUser.firstName} ${commentUser.lastName}`,
    comment: req.body.comment,
  };

  let finalUser = await _commentOps.addComment(profileUser, comment);

  res.render("user/profile", {
    editid: false,
    reqInfo: reqInfo,
    user: finalUser,
    errorMessage: "",
  });
};

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

exports.EditCommentPost = async (req, res) => {
  let reqInfo = RequestService.reqHelper(req);
  let profileUser = await _userOps.getUserById(req.body.userid);
  const comment = req.body;
  let updatedUser = await _commentOps.updateComment(profileUser, comment);
  if ((updatedUser = "S")) {
    res.redirect(`/profile/${req.body.userid}`);
  } else {
    res.render("user/profile", {
      editid: false,
      reqInfo: reqInfo,
      user: profileUser,
      errorMessage: "",
    });
  }
};

exports.DeleteComment = async (req, res) => {
  let reqInfo = RequestService.reqHelper(req);
  let profileUser = await _userOps.getUserById(req.params.id);
  const commentid = req.params.commentid;
  let deletedUser = await _commentOps.deleteComment(profileUser, commentid);
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
