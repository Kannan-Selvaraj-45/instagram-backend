const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class authToken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User }) {
      // define association here
      authToken.belongsTo(User, {
        foreignKey: "user_id",
        as: "author",
        onDelete: "CASCADE",
      });
    }
  }
  authToken.init(
    {
      user_id: DataTypes.INTEGER,
      token: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "authToken",
    }
  );

  return authToken;
};
