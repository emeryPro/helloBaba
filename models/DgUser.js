'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 

class DgUser extends Model {
  static associate(models) {
    // Relation avec le modèle User (DG)
    DgUser.belongsTo(models.User, {
      foreignKey: 'dg_id',
      as: 'dg', // Alias pour accéder au DG
    });

    // Relation avec le modèle User (Utilisateur secondaire)
    DgUser.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user', // Alias pour accéder à l'utilisateur secondaire
    });
  }
}

DgUser.init(
  {
    dg_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users', // Table des utilisateurs
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  },
  {
    sequelize,
    modelName: 'DgUser',
    tableName: 'dg_users',
    timestamps: true, // createdAt et updatedAt activés
  }
);

module.exports = DgUser;
