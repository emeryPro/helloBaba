// models/invoiceItem.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Chemin vers ta configuration Sequelize

class InvoiceItem extends Model {
  static associate(models) {
    // Relation avec le modèle Invoice
    InvoiceItem.belongsTo(models.Invoice, {
      foreignKey: 'invoice_id', // Clé étrangère dans InvoiceItem
      as: 'invoiceItem', // Alias pour accéder à la facture associée
      onDelete: 'CASCADE', // Suppression en cascade
    });
  }
}

InvoiceItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    designation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    json: {
      type: DataTypes.JSON,
      allowNull: true,
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
  },
  {
    sequelize, // Instance Sequelize injectée
    modelName: 'InvoiceItem', // Nom du modèle
    tableName: 'invoices_items', // Nom réel de la table dans la base de données
    timestamps: true, // Inclut createdAt et updatedAt
  }
);

module.exports = InvoiceItem;
