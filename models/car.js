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
      field: 'dateadded', // <-- match DB column
    },
    photoUrl: {
      type: DataTypes.TEXT,
      field: 'photourl', // <-- match DB column
    },
    ownerId: {
      type: DataTypes.INTEGER,
      field: 'ownerid', // <-- match DB column
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'createdat',
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updatedat',
    },
  }, {
    sequelize,
    modelName: 'Car',
    tableName: 'cars'
  });

  return Car;
};