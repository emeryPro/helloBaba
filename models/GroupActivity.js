'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class GroupActivity extends Model {
  static associate(models) {
    // Une relation avec Activity : Un groupe d'activité peut avoir plusieurs activités
    GroupActivity.hasMany(models.Activity, {
      foreignKey: 'groupe_activity_id',
      as: 'activities', // Alias pour accéder aux activités associées
    });
  }
}

GroupActivity.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Nom unique pour chaque groupe d'activité
    },
  },
  {
    sequelize,
    modelName: 'GroupActivity',
    tableName: 'group_activities', // Nom de la table dans la base de données
  }
);

module.exports = GroupActivity;
