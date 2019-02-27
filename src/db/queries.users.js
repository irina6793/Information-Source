const User = require("./models").User;
const bcrypt = require("bcryptjs");

module.exports = {
  createUser(newUser, callback) {
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(newUser.password, salt);

    return User.create({
      email: newUser.email,
      username: newUser.username,
      password: hashedPassword
    })
      .then(user => {
        callback(null, user);
      })
      .catch(err => {
        callback(err);
      });
  },

  upgradeUser(req, callback) {
    return User.findById(req.params.id).then(user => {
      if (!user) {
        return callback("User not found");
      }
      user
        .update({
          role: 1
        })
        .then(() => {
          callback(null, user);
        })
        .catch(err => {
          callback(err);
        });
    });
  },

  downgradeUser(req, callback) {
    return User.findById(req.params.id).then(user => {
      if (!user) {
        return callback("User not found");
      }
      user
        .update({
          role: 2
        })
        .then(() => {
          callback(null, user);
        })
        .catch(err => {
          callback(err);
        });
    });
  }
};
