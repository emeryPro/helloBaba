// models/invoice.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Chemin vers ta configuration Sequelize

class Invoice extends Model {
  static associate(models) {
    // Relation avec le modèle Customer
    Invoice.belongsTo(models.Customer, {
      foreignKey: 'customers_id', // Clé étrangère dans Invoice
      as: 'invoiceCustomer', // Alias pour accéder au client associé
      onUpdate: 'CASCADE', // Mise à jour en cascade
      onDelete: 'CASCADE', // Suppression en cascade
    });

    // Relation avec le modèle Activity
    Invoice.belongsTo(models.Activity, {
      foreignKey: 'activity_id', // Clé étrangère dans Invoice
      as: 'invoiceActivity', // Alias pour accéder à l'activité associée
      onUpdate: 'CASCADE', // Mise à jour en cascade
      onDelete: 'CASCADE', // Suppression en cascade
    });

    // Relation avec le modèle GroupActivity
    Invoice.belongsTo(models.GroupActivity, {
      foreignKey: 'group_activity_id', // Clé étrangère dans Invoice
      as: 'invoiceGroup_activity', // Alias pour accéder au groupe d'activité associé
      onUpdate: 'CASCADE', // Mise à jour en cascade
      onDelete: 'CASCADE', // Suppression en cascade
    });
  }
}

Invoice.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    facturenumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    statut: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    customers_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'customers', // Nom de la table cible
        key: 'id', // Clé primaire dans la table `customers`
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    activity_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'activities', // Nom de la table cible
        key: 'id', // Clé primaire dans la table `activities`
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    group_activity_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'group_activities', // Nom de la table cible
        key: 'id', // Clé primaire dans la table `group_activities`
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
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
    modelName: 'Invoice', // Nom du modèle
    tableName: 'invoices', // Nom réel de la table dans la base de données
    timestamps: true, // Inclut createdAt et updatedAt
  }
);

module.exports = Invoice;
