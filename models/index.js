'use strict';

const Sequelize = require('sequelize');
const process = require('process');
const config = require(__dirname + '/../config/config.json')[process.env.NODE_ENV || 'production'];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Directly import models
const Car = require('./car')(sequelize, Sequelize.DataTypes);
const User = require('./user')(sequelize, Sequelize.DataTypes);
// Add other models similarly
// const OtherModel = require('./otherModel')(sequelize, Sequelize.DataTypes);

// Add models to db object
db.Car = Car;
db.User = User;
// Add other models to db object
// db.OtherModel = OtherModel;

// Set up associations if they exist
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
