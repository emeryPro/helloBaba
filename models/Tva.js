// models/tva.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Chemin vers ta configuration Sequelize

class Tva extends Model {
  static associate(models) {
    // Relation avec le modèle Activity
    Tva.belongsTo(models.Activity, {
      foreignKey: 'activity_id', // Clé étrangère dans Tva
      as: 'activity', // Alias pour accéder à l'activité associée
      onDelete: 'CASCADE', // Suppression en cascade
      onUpdate: 'CASCADE', // Mise à jour en cascade
    });

    // Relation avec le modèle Setting
    Tva.belongsTo(models.Setting, {
      foreignKey: 'setting_id', // Clé étrangère dans Tva
      as: 'setting', // Alias pour accéder au setting associé
      onDelete: 'CASCADE', // Suppression en cascade
      onUpdate: 'CASCADE', // Mise à jour en cascade
    });
  }
}

Tva.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    value: {
      type: DataTypes.FLOAT,
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
    setting_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'settings', // Nom de la table cible
        key: 'id', // Clé primaire dans la table `settings`
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  },
  {
    sequelize, // Instance Sequelize injectée
    modelName: 'Tva', // Nom du modèle
    tableName: 'tva', // Nom réel de la table dans la base de données
    timestamps: true, // Inclut createdAt et updatedAt
  }
);

module.exports = Tva;
