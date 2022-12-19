const User = require("../models/User");

class UserOps {
  // Constructor
  UserOps() {}

  async getAllUsers() {
    console.log("** Getting all users");
    let users = await User.find().sort({ name: 1 });
    return users;
  }

  async getUserByUsername(username) {
    console.log(`** Getting users by name: ${username}`);
    const filter = { username: { $regex: username, $options: "i" } };
    let users = await User.find(filter).sort({ name: 1 });
    return users;
  }

  async getUserById(id) {
    console.log(`** Getting user by id: ${id}`);
    let user = await User.findOne({ _id: id });
    return user;
  }

  async getRolesByUsername(username) {
    let user = await User.findOne({ username: username }, { _id: 0, roles: 1 });
    if (user.roles) {
      return user.roles;
    } else {
      return [];
    }
  }

  async updateUserById(editedUser) {
    console.log(`** Updating user profile: ${editedUser.username}`);
    try {
      const user = await User.findOne({ _id: editedUser.id });
      user.firstName = editedUser.firstName;
      user.lastName = editedUser.lastName;
      user.email = editedUser.email;
      user.interests = editedUser.interests;
      user.photoPath = editedUser.photoPath;
      user.roles = editedUser.roles;
      let updatedUser = await user.save();
      return {
        user: updatedUser,
        message: "",
      };
    } catch (e) {
      return {
        user: editedUser,
        message: `${e}`,
      };
    }
  }

  async deleteUserById(id) {
    console.log(`** Deleting profile by id: ${id}`);
    try {
      let deletedUser = await User.findByIdAndDelete(id);
      console.log("Successfully deleted.");
      return "S";
    } catch (e) {
      console.log(`${e}`);
      return e;
    }
  }

  // async getUserByEmail(email) {
  //   let user = await User.findOne({ email: email });
  //   if (user) {
  //     const response = { obj: user, errorMessage: "" };
  //     return response;
  //   } else {
  //     return null;
  //   }
  // }
}

module.exports = UserOps;
