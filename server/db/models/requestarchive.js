'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RequestArchive extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  RequestArchive.init({
    apiUser: DataTypes.INTEGER,
    apiUserHash: DataTypes.STRING,
    requestId: DataTypes.STRING,
    operation: DataTypes.STRING,
    tags: DataTypes.JSON,
    args: DataTypes.JSON,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'RequestArchive',
  });
  return RequestArchive;
};