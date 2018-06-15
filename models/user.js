'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    username: DataTypes.STRING,
    githubid: DataTypes.STRING,
    password: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Answer);
  };
  return User;
};

module.exports = (sequelize, DataTypes) => {
  var tUser = sequelize.define('User', {
    username: DataTypes.STRING,
    twitterid: DataTypes.STRING,
    password: DataTypes.STRING
  }, {});
  tUser.associate = function(models) {
    // associations can be defined here
    tUser.hasMany(models.Answer);
  };
  return tUser;
};