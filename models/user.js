"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate({ Post, Comment, Like, authToken, HidePost }) {
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
      hooks: {
        beforeDestroy: async (user) => {
          const { Post, Comment, Like } = sequelize.models;

          // Delete all associated posts
          await Post.destroy({ where: { user_id: user.id }, ...options });

          // Delete all associated comments
          await Comment.destroy({ where: { user_id: user.id }, ...options });

          // Delete all associated likes
          await Like.destroy({ where: { user_id: user.id }, ...options });
        },
      },
    }
  );

  return User;
};
