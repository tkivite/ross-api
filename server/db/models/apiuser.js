'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ApiUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  ApiUser.init({
    apiKey: DataTypes.STRING,
    apiSecret: DataTypes.STRING,
    address: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ApiUser',
  });
  return ApiUser;
};