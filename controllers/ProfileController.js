const RequestService = require("../services/RequestService");
const path = require("path");

// Import class for handling DB CRUD
const UserOps = require("../data/UserOps");
const _userOps = new UserOps();

// Get all users
exports.Users = async (req, res) => {
  let reqInfo = RequestService.reqHelper(req);

  // Search
  const filter = req.query.filter;
  const search = req.query.search;

  let users = null;

  switch (filter) {
    case "username":
      users = await _userOps.getUserByUsername(search);
      break;
    case "email":
      users = await _userOps.getUserByEmail(search);
      break;
    case "name":
      users = await _userOps.getUserByName(search);
      break;
    case "interests":
      users = await _userOps.getUserByInterests(search);
      break;
    default:
      users = await _userOps.getAllUsers();
      break;
  }

  res.render("users", {
    users: users,
    reqInfo: reqInfo,
    search: search,
  });
};

// Logged in user profile
exports.Profile = async function (req, res) {
  let reqInfo = RequestService.reqHelper(req);

  // Only logged in user can see this view
  if (reqInfo.authenticated) {
    let user = [];
    const userId = req.params.id;
    if (userId) {
      user = await _userOps.getUserById(userId);
    } else {
      user = await _userOps.getUserById(reqInfo.id);
    }

    // Add user roles
    let roles = await _userOps.getRolesByUsername(reqInfo.username);
    let sessionData = req.session;
    sessionData.roles = roles;
    reqInfo.roles = roles;

    res.render("user/profile", {
      editid: false,
      reqInfo: reqInfo,
      user: user,
      errorMessage: "",
    });
  } else {
    res.redirect("/secure");
  }
};

// GET Edit
exports.Edit = async (req, res) => {
  let reqInfo = RequestService.reqHelper(req);

  if (reqInfo.authenticated) {
    let userId;
    if (req.params.id) {
      userId = req.params.id;
    } else {
      userId = reqInfo.id;
    }
    let user = await _userOps.getUserById(userId);

    if (user) {
      res.render("user/profile-edit", {
        user: user,
        reqInfo: reqInfo,
        errorMessage: "",
      });
    }
  } else {
    res.redirect("/secure");
  }
};

// POST Edit
exports.EditPost = async (req, res) => {
  let reqInfo = RequestService.reqHelper(req);

  let oldUser = await _userOps.getUserById(req.params.id);
  // Handle image file
  const file = req.files;
  let photoPath = "";
  if (file) {
    const photo = file.photo;
    photoPath = `/images/${photo.name}`;
    const serverPath = path.join(__dirname, "../public", photoPath);
    photo.mv(serverPath);
  } else {
    photoPath = oldUser.photoPath;
  }

  // Update DB
  const editedUser = {
    id: req.params.id,
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    interests: req.body.interests,
    photoPath: photoPath,
    roles: req.body.roles || [],
  };
  let updatedUser = await _userOps.updateUserById(editedUser);

  // if no errors, save was successful
  if (updatedUser) {
    res.redirect(`/profile/${editedUser.id}`);
  }
  // There are errors. Show form the again with an error message.
  else {
    res.render("user/profile-edit", {
      user: editedUser,
      reqInfo: reqInfo,
      errorMessage: updatedUser.message,
    });
  }
};

// GET Password Edit
exports.EditPassword = async (req, res) => {
  let reqInfo = RequestService.reqHelper(req);

  if (reqInfo.authenticated) {
    res.render("user/change-pw", {
      userid: req.params.id,
      reqInfo: reqInfo,
      errorMessage: "",
    });
  } else {
    res.redirect("/secure");
  }
};

// POST Password Edit
exports.EditPasswordPost = async (req, res) => {
  let reqInfo = RequestService.reqHelper(req);
  const userId = req.params.id;

  // login user only
  if (reqInfo.authenticated) {
    let oldUser = await _userOps.getUserById(req.params.id);
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    const password2 = req.body.passwordConfirm;

    // password match verification
    if (newPassword != password2) {
      res.render("user/change-pw", {
        userid: userId,
        reqInfo: reqInfo,
        errorMessage: "Password doesn't match!",
      });
    } else {
      oldUser.changePassword(oldPassword, newPassword, (err) => {
        if (err) {
          console.log(err);
          return res.render("user/change-pw", {
            userid: userId,
            reqInfo: reqInfo,
            errorMessage: err,
          });
        } else {
          return res.render("user/change-pw", {
            userid: userId,
            reqInfo: reqInfo,
            errorMessage: "Successfully Changed",
          });
        }
      });
    }
  } else {
    return res.redirect("/secure");
  }
};

// Delete
exports.Delete = async (req, res) => {
  let reqInfo = RequestService.reqHelper(req);
  const roles = reqInfo.roles;
  let userRole = [];
  if (roles.includes("Admin")) {
    userRole = "Admin";
  }

  // Authenticated login user only can access here
  if (reqInfo.authenticated) {
    let userId;
    if (req.params) {
      userId = req.params.id;
    } else {
      userId = reqInfo.id;
    }

    // Delete account
    let user = await _userOps.getUserById(userId);
    let deletedUser = await _userOps.deleteUserById(userId);

    // If loggedin user is admin, back to profile or else logout.
    if (deletedUser == "S") {
      if (userRole == "Admin") {
        console.log("✅Role : ", userRole);
        return res.redirect("/profile/users");
      } else {
        req.logout((err) => {
          if (err) {
            console.log(">>> Logout error: ", err);
            return next(err);
          } else {
            res.redirect("/");
          }
        });
      }
    } else {
      res.render("user/profile", {
        editid: false,
        user: user,
        reqInfo: reqInfo,
        errorMessage: deletedUser,
      });
    }
  } else {
    res.redirect("/secure");
  }
};
