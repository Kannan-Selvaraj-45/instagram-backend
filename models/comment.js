"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Post, User }) {
      // define association here
      Comment.belongsTo(Post, {
        foreignKey: "post_id",
        as: "posts",
      });

      Comment.belongsTo(User, {
        foreignKey: "user_id",
        as: "author",
      });
    }
  }
  Comment.init(
    {
      post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Comment",
    }
  );
  return Comment;
};
