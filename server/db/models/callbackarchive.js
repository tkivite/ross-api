'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CallbackArchive extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  CallbackArchive.init({
    requestId: DataTypes.STRING,
    operation: DataTypes.STRING,
    success: DataTypes.BOOLEAN,
    args: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'CallbackArchive',
  });
  return CallbackArchive;
};