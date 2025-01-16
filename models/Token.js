'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 



class Token extends Model {
  static associate(models) {
    Token.belongsTo(models.User, {
      foreignKey: 'user_id', // Clé étrangère dans User
      onDelete: 'CASCADE'
    });
    
  }
}



Token.init(
    {
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        token: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        expiration_date: {
          type: DataTypes.DATE,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'Token',
        tableName: 'tokens',
        timestamps: true,
      }
);

module.exports = Token;




