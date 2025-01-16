'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 


  class Role extends Model {
    static associate(models) {
      // Définir une association avec le modèle User
      Role.hasMany(models.User, {
        foreignKey: 'role_id', // Clé étrangère dans le modèle User
        as: 'users', // Alias pour accéder aux utilisateurs associés
      });
    }
  }
  
  Role.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Chaque rôle doit être unique
      },
    },
    {
      sequelize,
      modelName: 'Role', // Nom du modèle
      tableName: 'roles', // Nom de la table (en minuscule)
    }
  );

  module.exports = Role;

