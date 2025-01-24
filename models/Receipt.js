// models/receipt.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Chemin vers ta configuration Sequelize

class Receipt extends Model {
  static associate(models) {
    // Relation avec le modèle Invoice
    Receipt.belongsTo(models.Invoice, {
      foreignKey: 'invoice_id', // Clé étrangère dans Receipt
      as: 'receiptInvoice', // Alias pour accéder à la facture associée
      onDelete: 'CASCADE', // Suppression en cascade
    });
  }
}

Receipt.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    reference_payement: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    invoice_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'invoices', // Nom de la table cible
        key: 'id', // Clé primaire dans la table `invoices`
      },
      onDelete: 'CASCADE',
    },
    amound_paid: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    createBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users', // Nom de la table cible
          key: 'id', // Clé primaire dans la table `Activities`
        },
        onUpdate: 'CASCADE', // Mise à jour en cascade
        onDelete: 'CASCADE', // Suppression en cascade
      },
  },
  {
    sequelize, // Instance Sequelize injectée
    modelName: 'Receipt', // Nom du modèle
    tableName: 'receipts', // Nom réel de la table dans la base de données
    timestamps: true, // Inclut createdAt et updatedAt
  }
);

module.exports = Receipt;
