// models/order.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Order extends Model {
  static associate(models) {
    // Relation avec le modèle User
    Order.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user', // Alias pour accéder à l'utilisateur associé
    });

    // Relation avec le modèle Activity
    Order.belongsTo(models.Activity, {
      foreignKey: 'activity_id',
      as: 'activity', // Alias pour accéder à l'activité associée
    });
  }
}

Order.init(
  {
    amount_withdrawn: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'cancelled'),
      defaultValue: 'pending',
    },
    withdrawal_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    notes: {
      type: DataTypes.STRING,
      allowNull: true,
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
    activity_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'activities', // Nom de la table des activités
        key: 'id', // Clé primaire de la table `activities`
      },
      onDelete: 'CASCADE',
    },
  },
  {
    sequelize,
    modelName: 'Order',
    tableName: 'orders',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  }
);

module.exports = Order;
