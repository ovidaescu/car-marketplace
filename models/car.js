'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Car extends Model {
    static associate(models) {
      // Define associations here
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
    dateAdded: 
    {
      type: DataTypes.DATE,
      field: 'dateadded',
    },
    url: 
    {
      type: DataTypes.TEXT,
      field: 'photourl',
    },
    ownerId:
    {
      type: DataTypes.INTEGER,
      field: 'ownerid',
    },
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
    modelName: 'Car', // Ensure this matches the name used in the `db` object
    tableName: 'cars'
  });

  return Car;
};