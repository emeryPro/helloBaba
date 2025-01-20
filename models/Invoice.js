// models/invoice.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Invoice extends Model {
  static associate(models) {
    // Relation avec le modèle Tontine
    Invoice.belongsTo(models.Tontine, {
      foreignKey: 'tontine_id',
      as: 'tontine', // Alias pour accéder à la tontine associée
    });

    // Relation avec le modèle User
    Invoice.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user', // Alias pour accéder à l'utilisateur associé
    });

    // Relation avec le modèle Participant
    Invoice.belongsTo(models.Participant, {
      foreignKey: 'participant_id',
      as: 'participant', // Alias pour accéder au participant associé
    });

    Invoice.hasMany(models.Receipt, {
        foreignKey: 'invoice_id',
        as: 'receipts',
      });
  }
}

Invoice.init(
  {
    tontine_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tontines', // Nom de la table des tontines
        key: 'id', // Clé primaire de la table `tontines`
      },
      onDelete: 'CASCADE',
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users', // Nom de la table des utilisateurs
        key: 'id', // Clé primaire de la table `users`
      },
      onDelete: 'CASCADE',
    },
    participant_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'participants', // Nom de la table des participants
        key: 'id', // Clé primaire de la table `participants`
      },
      onDelete: 'CASCADE',
    },
    amount_due: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    due_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('paid', 'unpaid', 'overdue'),
      defaultValue: 'unpaid',
    },
    payment_date: {
      type: DataTypes.DATE,
      allowNull: true, // Peut être null si non payé
    },
  },
  {
    sequelize,
    modelName: 'Invoice',
    tableName: 'invoices',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  }
);

module.exports = Invoice;