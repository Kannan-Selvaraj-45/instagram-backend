"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Comment, Like }) {
      // define association here
      Post.hasMany(Comment, {
        foreignKey: "post_id",
        as: "comments",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });

      Post.hasMany(Like, {
        foreignKey: "post_id",
        as: "likes",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });

      Post.belongsTo(User, {
        foreignKey: "user_id",
        as: "author",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  Post.init(
    {
      caption: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      img_url: DataTypes.STRING,
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Post",
    }
  );
  return Post;
};
