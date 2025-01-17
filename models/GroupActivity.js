
'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');




class GroupActivity extends Model {
  static associate(models) {

    GroupActivity.hasMany(models.Activity, {
      foreignKey: 'groupe_activity_id', 
      as: 'activities', 
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
    tableName: 'group_activities', 
  }
);

module.exports = GroupActivity;
