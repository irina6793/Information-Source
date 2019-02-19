'use strict';
module.exports = (sequelize, DataTypes) => {
  var Wiki = sequelize.define('Wiki', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    body: {
      type: DataTypes.STRING,
      allowNull: false
    },
    private: {
      type: DataTypes.STRING,
      defaultValue: false
    },
    userId: {
          type: DataTypes.INTEGER,
          onDelete: "CASCADE",
          references: {
            model: "Users",
            key: "id",
            as: "userId"
          }
       },
  });
   Wiki.associate = function(models) {
     // associations can be defined here
      Wiki.belongsTo(models.User, {
          foreignKey: "userId",
          as: "CASCADE",
     });
  };

  return Wiki;
};
