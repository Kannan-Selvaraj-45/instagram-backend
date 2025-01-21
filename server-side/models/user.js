"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Post, Comment, Like, authToken }) {
      // define association here
      User.hasMany(Post, {
        foreignKey: "user_id",
        as: "posts",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });

      User.hasMany(Comment, {
        foreignKey: "user_id",
        as: "comments",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });

      User.hasMany(Like, {
        foreignKey: "user_id",
        as: "likes",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });

      User.hasOne(authToken, {
        foreignKey: "user_id",
        as: "token",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });

      User.belongsToMany(User, {
        through: "Followers",
        as: "followers", // Users following this user
        foreignKey: "following_id",
        otherKey: "follower_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });

      User.belongsToMany(User, {
        through: "Followers",
        as: "following", // Users this user is following
        foreignKey: "follower_id",
        otherKey: "following_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      profile_picture: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
