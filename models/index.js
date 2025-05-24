'use strict';

console.log('models/index.js loaded');

const Sequelize = require('sequelize');
const process = require('process');
const env = process.env.NODE_ENV || 'production';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

// Use environment variables if available, otherwise fallback to config.json
const dbHost = process.env.DB_HOST || config.host;
const dbPort = process.env.DB_PORT || config.port || 5432;
const dbUser = process.env.DB_USER || config.username;
const dbPassword = process.env.DB_PASSWORD || config.password;
const dbName = process.env.DB_NAME || config.database;

console.log('Connecting to DB at:', dbHost, dbPort);
let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(dbName, dbUser, dbPassword, {
    ...config,
    host: dbHost,
    port: dbPort,
  });
}

// ...rest of your code...

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
