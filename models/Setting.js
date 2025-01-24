// models/setting.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Chemin vers ta configuration Sequelize

class Setting extends Model {
  static associate(models) {
    // Relation avec le modèle Activity
    Setting.belongsTo(models.Activity, {
      foreignKey: 'activity_id', // Clé étrangère dans Setting
      as: 'activitySetting', // Alias pour accéder à l'activité associée
      onDelete: 'CASCADE', // Suppression en cascade
      onUpdate: 'CASCADE', // Mise à jour en cascade
    });
  }
}

Setting.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    tva: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    client: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    activity_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'activities', // Nom de la table cible
        key: 'id', // Clé primaire dans la table `activities`
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  },
  {
    sequelize, // Instance Sequelize injectée
    modelName: 'Setting', // Nom du modèle
    tableName: 'settings', // Nom réel de la table dans la base de données
    timestamps: true, // Inclut createdAt et updatedAt
  }
);

module.exports = Setting;
