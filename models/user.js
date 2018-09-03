var bcrypt = require("bcrypt-nodejs");

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    // userID: DataTypes.UUID,
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    image: {
      type: DataTypes.STRING
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
  User.prototype.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };
  User.hook("beforeCreate", function(user) {
    user.password = bcrypt.hashSync(
      user.password,
      bcrypt.genSaltSync(10),
      null
    );
  });
  User.associate = function(models) {
    User.hasMany(models.Project, {
      as: "collaboratorId",
      foreignKey: "collaboratorId"
    });
    User.hasOne(models.Project, {
      as: "ownerId",
      foreignKey: "ownerId"
    });
    User.hasMany(models.Messages, {
      onDelete: "cascade"
    });
    User.hasMany(models.Collaborator, {
      onDelete: "cascade"
    });
    User.hasMany(models.Skill, {
      onDelete: "cascade"
    });
  };

  return User;
};
