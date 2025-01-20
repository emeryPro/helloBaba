// models/dayClosure.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class DayClosure extends Model {
  static associate(models) {
    // Relation avec le modèle User
    DayClosure.belongsTo(models.User, {
      foreignKey: 'approved_by',
      as: 'approvedBy', // Alias pour accéder à l'utilisateur ayant approuvé la clôture
    });
  }
}

DayClosure.init(
  {
    date_closure: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    total_transactions: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
    },
    cash_balance: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
    },
    approved_by: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users', // Nom de la table des utilisateurs
        key: 'id', // Clé primaire de la table `users`
      },
      allowNull: true,
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'DayClosure',
    tableName: 'day_closures',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

module.exports = DayClosure;
