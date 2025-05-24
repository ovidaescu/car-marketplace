'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Car extends Model {
    static associate(models) {
      Car.belongsTo(models.User, { foreignKey: 'ownerId', as: 'owner' });
    }
  }

  Car.init({
    make: DataTypes.STRING,
    model: DataTypes.STRING,
    type: DataTypes.STRING,
    year: DataTypes.INTEGER,
    km: DataTypes.INTEGER,
    fuel: DataTypes.STRING,
    price: DataTypes.FLOAT,
    dateAdded: {
      type: DataTypes.DATE,
      field: 'dateAdded', // <-- match DB column
    },
    photoUrl: {
      type: DataTypes.TEXT,
      field: 'photoUrl', // <-- match DB column
    },
    ownerId: {
      type: DataTypes.INTEGER,
      field: 'ownerId', // <-- match DB column
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'createdAt',
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updatedAt',
    },
  }, {
    sequelize,
    modelName: 'Car',
    tableName: 'cars'
  });

  return Car;
};