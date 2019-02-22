'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
     email: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            isEmail: { msg: "must be a valid email" }
          }
        },
    username: {
          type: DataTypes.STRING,
          allowNull: false
        },
    password: {
            type: DataTypes.STRING,
            allowNull: false
        },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "standard"
      }
  }, {});
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Wiki, {
              foreignKey: "userId",
              as: "wikis"
            });
    User.prototype.isAdmin = function() {
      return this.role === "admin";      
  };
  return User;
};
