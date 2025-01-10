"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Post, Comment, Like }) {
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
