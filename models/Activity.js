
'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Activity extends Model {
  static associate(models) {


    // Une activité appartient à un groupe d'activités
    Activity.belongsTo(models.GroupActivity, {
        foreignKey: 'groupe_activity_id',
        as: 'group_activities', // Alias pour accéder au groupe associé
      });
  
      // Une activité peut être liée à un utilisateur
      Activity.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user', // Alias pour accéder à l'utilisateur associé
      });
      Activity.belongsToMany(models.User, {
          through: 'activityuser',
          foreignKey: 'activity_id', 
          as: 'users',
        });
        console.log('Association de Activity avec GroupActivity et User définie.');


  /*     Activity.associate = function(models){
        Activity.belongsTo(models.GroupActivity, {
            foreignKey: 'groupe_activity_id',
            as: 'group'
        })
      }   */
    }
}

Activity.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    groupe_activity_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'group_activities', // Nom de la table cible
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users', // Nom de la table cible
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
  },
  {
    sequelize,
    modelName: 'Activity',
    tableName: 'activities', // Nom de la table dans la base de données
  }
);

module.exports = Activity;
