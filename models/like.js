"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Post, User }) {
      // define association here
      Like.belongsTo(Post, {
        foreignKey: "post_id",
        as: "posts",
      });

      Like.belongsTo(User, {
        foreignKey: "user_id",
        as: "author",
      });
    }
  }
  Like.init(
    {
      post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Like",
    }
  );
  return Like;
};
