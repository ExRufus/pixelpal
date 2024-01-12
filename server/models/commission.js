'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Commission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Commission.init({
    artist_address: DataTypes.STRING,
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.INTEGER,
    max_revision: DataTypes.INTEGER,
    availability: DataTypes.BOOLEAN,
    image_url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Commission',
  });
  return Commission;
};