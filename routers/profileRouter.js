const express = require("express");
const router = express.Router();

const ProfileController = require("../controllers/ProfileController");
const CommentController = require("../controllers/CommentController");

// Users List
router.get("/users", ProfileController.Users);

// Detail
router.get("/", ProfileController.Profile);
router.get("/:id", ProfileController.Profile);

// Edit
router.get("/edit/:id", ProfileController.Edit);
router.post("/edit/:id", ProfileController.EditPost);

// Delete
router.get("/delete/:id", ProfileController.Delete);

// Comment
router.post("/:id", CommentController.AddComment);

router.get("/:id/comment/edit/:commentid", CommentController.EditComment);
router.post("/:id/comment/edit/:commentid", CommentController.EditCommentPost);
router.get("/:id/comment/delete/:commentid", CommentController.DeleteComment);

module.exports = router;
