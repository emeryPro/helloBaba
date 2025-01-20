// models/tontine.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Tontine extends Model {
  static associate(models) {
    // Relation avec le modèle Participant
    Tontine.belongsTo(models.Participant, {
      foreignKey: 'participant_id',
      as: 'participant', // Alias pour accéder au participant associé
    });

    // Relation avec le modèle Activity
    Tontine.belongsTo(models.Activity, {
      foreignKey: 'activity_id',
      as: 'activity', // Alias pour accéder à l'activité associée
    });

    Tontine.hasMany(models.Receipt, {
        foreignKey: 'tontine_id',
        as: 'receipts',
      });
  }
}

Tontine.init(
  {
    participant_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'participants', // Nom de la table des participants
        key: 'id', // Clé primaire de la table `participants`
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
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    card_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    amount_per_payment: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    payment_frequency: {
      type: DataTypes.ENUM('daily', 'weekly', 'monthly', 'quarterly'),
      allowNull: false,
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    total_contributed: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
    },
  },
  {
    sequelize,
    modelName: 'Tontine',
    tableName: 'tontines',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  }
);

module.exports = Tontine;
