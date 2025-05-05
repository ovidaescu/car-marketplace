'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Car, { foreignKey: 'ownerId', as: 'cars' });
    }
  }
  User.init({
    name: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.INTEGER,
    createdAt: {
      type: DataTypes.DATE,
      field: 'createdat', // Map to lowercase column in the database
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updatedat', // Map to lowercase column in the database
    },
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users'
  });
  return User;
};