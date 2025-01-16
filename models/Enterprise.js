'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 

  class Enterprise extends Model {
    static associate(models) {
      // Définir une relation avec le modèle User
      Enterprise.hasMany(models.User, {
        foreignKey: 'enterprise_id',  // Clé étrangère dans le modèle User
        as: 'users',  // Alias pour accéder aux utilisateurs associés
      });
    }
  }

  Enterprise.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      ifu: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      rccm: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      statut_juridique: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Enterprise',
      tableName: 'enterprises',
    }
  );

  module.exports = Enterprise;

