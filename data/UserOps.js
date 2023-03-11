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

  async getUserByEmail(email) {
    const filter = { email: { $regex: email, $options: "i" } };
    let users = await User.find(filter).sort({ name: 1 });
    return users;
  }

  async getUserByName(name) {
    const filter = { firstname: { $regex: name, $options: "i" } } || { lastname: { $regex: name, $options: "i" } };
    let users = await User.find(filter).sort({ name: 1 });
    return users;
  }

  async getUserByInterests(interests) {
    const filter = { interests: { $regex: interests, $options: "i" } };
    let users = await User.find(filter).sort({ name: 1 });
    return users;
  }

  async getUserById(id) {
    // Get user
    let user = await User.findOne({ _id: id }).populate("comments");

    // Populate comments
    for (let i = 0; i < user.comments.length; i++) {
      await user.comments[i].populate("user");
    }

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
    try {
      let user = await User.findOne({ _id: editedUser.id });
      user.firstName = editedUser.firstName;
      user.lastName = editedUser.lastName;
      user.email = editedUser.email;
      user.interests = editedUser.interests;
      user.photoPath = editedUser.photoPath;
      user.roles = editedUser.roles;

      await user.save();
      return true;
    } catch (e) {
      console.log("❌Update DB Error: ", e);
      return e;
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
}

module.exports = UserOps;
