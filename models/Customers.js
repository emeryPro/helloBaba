// models/customer.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Chemin vers ta configuration Sequelize

class Customer extends Model {
  static associate(models) {
    // Relation avec le modèle Activity
    Customer.belongsTo(models.Activity, {
      foreignKey: 'activity_id', // Clé étrangère dans Customer
      as: 'customerActivity', // Alias pour accéder à l'activité associée
      onUpdate: 'CASCADE', // Mise à jour en cascade
      onDelete: 'CASCADE', // Suppression en cascade
    });

    // Si des relations supplémentaires sont ajoutées à l'avenir, elles peuvent être définies ici
  }
}

Customer.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    activity_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'activities', // Nom de la table cible
        key: 'id', // Clé primaire dans la table `Activities`
      },
      onUpdate: 'CASCADE', // Mise à jour en cascade
      onDelete: 'CASCADE', // Suppression en cascade
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
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phonenumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize, // Instance Sequelize injectée
    modelName: 'Customer', // Nom du modèle
    tableName: 'customers', // Nom réel de la table dans la base de données
    timestamps: true, // Inclut automatiquement les colonnes createdAt et updatedAt
  }
);

module.exports = Customer;
