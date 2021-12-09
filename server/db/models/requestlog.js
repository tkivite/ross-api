'use strict';
const { INTEGER } = require('sequelize');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RequestLog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  RequestLog.init({
    operation: DataTypes.STRING,
    apiUser:INTEGER,
    tags: DataTypes.JSON,
    args: DataTypes.JSON,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'RequestLog',
  });
  return RequestLog;
};