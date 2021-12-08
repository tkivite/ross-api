'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
//const config = require(__dirname + '/../config/config.json')[env];
const db = {};
console.log(process.env);
let sequelize;

let db_options =  {
"host":  process.env.DB_HOST,
"dialect": process.env.DB_DIALECT,
"logging": true,
"multipleStatements": true,
"pool": {
  "max": 20,
  "min": 0,
  "acquire": 30000,
  "idle": 10000
},
"dialectOptions": {
  "useUTC": false,
  "dateStrings": true,
  "typeCast": true
},
"timezone": "+03:00"
}
sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, db_options)


fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
