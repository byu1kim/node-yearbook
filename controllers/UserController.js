const path = require("path");
const User = require("../models/User");
const passport = require("passport");
const RequestService = require("../services/RequestService");

// Register: GET
exports.Register = (req, res) => {
  let reqInfo = RequestService.reqHelper(req);
  if (reqInfo.authenticated) {
    res.redirect("/user/profile");
  } else {
    res.render("user/register", {
      errorMessage: "",
      user: {},
      reqInfo: reqInfo,
    });
  }
};

// Register: POST
exports.RegisterPost = async (req, res) => {
  let reqInfo = RequestService.reqHelper(req);

  // Save picture in the public folder
  const file = req.files;
  let photoPath = "";
  if (file) {
    const photo = file.photo;
    photoPath = `/images/${photo.name}`;
    const serverPath = path.join(__dirname, "../public", photoPath);
    photo.mv(serverPath);
  }

  // User object
  const user = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    username: req.body.username,
    interests: req.body.interests,
    photoPath: photoPath,
    roles: ["user"],
  };

  const password = req.body.password;
  const passwordConfirm = req.body.passwordConfirm;

  // Save user when the password matches.
  if (password == passwordConfirm) {
    User.register(new User(user), req.body.password, (err) => {
      if (err) {
        return res.render("user/register", {
          user: user,
          errorMessage: err,
          reqInfo: reqInfo,
        });
      }
      // Login after signup
      passport.authenticate("local")(req, res, () => {
        res.redirect("/profile");
      });
    });
  } else {
    res.render("user/register", {
      user: user,
      errorMessage: "Passwords do not match.",
      reqInfo: reqInfo,
    });
  }
};

// Login: GET
exports.Login = (req, res) => {
  let reqInfo = RequestService.reqHelper(req);
  if (reqInfo.authenticated) {
    // Redirect to profile page when login user try to access login page
    res.redirect("/profile");
  } else {
    res.render("user/login", { reqInfo: reqInfo, errorMessage: "" });
  }
};

// Login: POST
exports.LoginPost = async (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login?errorMessage=Invalid login.",
  })(req, res, next);
};

// Logout
exports.Logout = (req, res) => {
  // Use Passports logout function
  req.logout((err) => {
    if (err) {
      console.log(">>> Logout error");
      return next(err);
    } else {
      // Logged out. Update the reqInfo and redirect to the login page
      let reqInfo = RequestService.reqHelper(req);
      res.render("user/login", {
        isLoggedIn: false,
        reqInfo: reqInfo,
        errorMessage: "",
      });
    }
  });
};
