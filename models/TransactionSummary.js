// models/TransactionSummary.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class TransactionSummary extends Model {
  static associate(models) {
    // Relation avec le modèle User
    TransactionSummary.belongsTo(models.User, {
      foreignKey: 'summary_by',
      as: 'summaryBy', // Alias pour accéder à l'utilisateur ayant généré le résumé
    });
  }
}

TransactionSummary.init(
  {
    date_summary: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    total_deposits: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      allowNull: false,
    },
    total_withdrawals: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      allowNull: false,
    },
    cash_in_hand: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      allowNull: false,
    },
    summary_by: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users', // Table des utilisateurs
        key: 'id', // Clé primaire de la table `users`
      },
      allowNull: true,
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
  },
  {
    sequelize,
    modelName: 'TransactionSummary',
    tableName: 'transaction_summary',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

module.exports = TransactionSummary;
