/*
DB: Detail, Edit, Delete
*/

const RequestService = require("../services/RequestService");

// Import class for handling DB CRUD
const UserOps = require("../data/UserOps");
const _userOps = new UserOps();

// Entire user list
exports.Users = async (req, res) => {
  let reqInfo = RequestService.reqHelper(req);
  let users = null;

  // Search
  const search = req.query.search;
  if (search) {
    users = await _userOps.getUserByUsername(search);
  } else {
    users = await _userOps.getAllUsers();
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
    let users = await _userOps.getAllUsers();
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
      search: "",
      users: users,
    });
  } else {
    res.redirect("/secure");
  }
};

// Edit: GET
exports.Edit = async (req, res) => {
  let reqInfo = RequestService.reqHelper(req);

  if (reqInfo.authenticated) {
    let user = [];
    const userId = req.params.id;
    user = await _userOps.getUserById(userId);

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

// Edit: POST
exports.EditPost = async (req, res) => {
  // Handle image file
  const file = req.files;
  let photoPath = "";
  if (file) {
    const photo = file.photo;
    photoPath = `/images/${photo.name}`;
    const serverPath = path.join(__dirname, "../public", photoPath);
    photo.mv(serverPath);
  }

  // ** ADD Password Update function !!

  // Update DB
  console.log(req.body);
  const editedUser = {
    id: req.params.id,
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    interests: req.body.interests,
    photoPath: photoPath,
    roles: req.body.roles,
  };

  let updatedUser = await _userOps.updateUserById(editedUser);
  let reqInfo = RequestService.reqHelper(req);

  // if no errors, save was successful
  if (updatedUser.message == "") {
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

// Delete
exports.Delete = async (req, res) => {
  let reqInfo = RequestService.reqHelper(req);
  if (reqInfo.authenticated) {
    const userId = req.params.id;
    let deletedUser = await _userOps.deleteUserById(userId);
    let user = await _userOps.getUserById(userId);

    if (deletedUser == "S") {
      res.redirect("/profile/users");
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
