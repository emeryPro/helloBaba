// models/permissionToUser.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Chemin vers ta configuration Sequelize

class PermissionToUser extends Model {
  static associate(models) {
    // Définir les relations entre cette table et d'autres modèles
    // Par exemple : 
    // PermissionToUser.belongsTo(models.User, { foreignKey: 'user_id' });
    // PermissionToUser.belongsTo(models.Permission, { foreignKey: 'permission_id' });
  }
}

PermissionToUser.init(
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users', // Table associée
        key: 'id', // Clé primaire dans la table `users`
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    permission_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'permissions', // Table associée
        key: 'id', // Clé primaire dans la table `permissions`
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  },
  {
    sequelize,
    modelName: 'PermissionToUser', // Nom du modèle
    tableName: 'permission_to_users', // Nom réel de la table dans la base de données
    timestamps: false, // Pas besoin de createdAt/updatedAt pour une table d'association
  }
);

module.exports = PermissionToUser;
