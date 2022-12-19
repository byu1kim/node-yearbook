const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");

// Login, Logout
router.get("/login", UserController.Login);
router.post("/login", UserController.LoginPost);
router.get("/logout", UserController.Logout);

// Register
router.get("/register", UserController.Register);
router.post("/register", UserController.RegisterPost);

module.exports = router;
