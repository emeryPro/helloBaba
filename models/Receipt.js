// models/receipt.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Receipt extends Model {
  static associate(models) {
    // Relation avec le modèle Tontine
    Receipt.belongsTo(models.Tontine, {
      foreignKey: 'tontine_id',
      as: 'tontine', // Alias pour accéder à la tontine associée
    });

    // Relation avec le modèle Invoice
    Receipt.belongsTo(models.Invoice, {
      foreignKey: 'invoice_id',
      as: 'invoice', // Alias pour accéder à la facture associée
    });

    // Relation avec le modèle Participant
    Receipt.belongsTo(models.Participant, {
      foreignKey: 'participant_id',
      as: 'participant', // Alias pour accéder au participant associé
    });
  }
}

Receipt.init(
  {
    payment_reference: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    tontine_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tontines', // Nom de la table des tontines
        key: 'id', // Clé primaire de la table `tontines`
      },
      onDelete: 'CASCADE',
    },
    invoice_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'invoices', // Nom de la table des factures
        key: 'id', // Clé primaire de la table `invoices`
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
    amount_paid: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    receipt_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    payment_status: {
      type: DataTypes.ENUM('paid', 'unpaid'),
      defaultValue: 'paid',
    },
  },
  {
    sequelize,
    modelName: 'Receipt',
    tableName: 'receipts',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  }
);

module.exports = Receipt;
