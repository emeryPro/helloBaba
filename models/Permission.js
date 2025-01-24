// models/permission.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Chemin vers ta configuration Sequelize

class Permission extends Model {
  static associate(models) {
    // Associer la permission à d'autres modèles si nécessaire
    // Exemple : Permission.belongsTo(models.Role, { foreignKey: 'role_id' });
  }
}

Permission.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize, // Instance Sequelize injectée
    modelName: 'Permission', // Nom du modèle
    tableName: 'permissions', // Nom réel de la table dans la base de données
    timestamps: true, // Inclut createdAt et updatedAt
  }
);

module.exports = Permission;
