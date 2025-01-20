// models/participant.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Participant extends Model {
  static associate(models) {
    // Relation avec le modèle User
    Participant.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user', // Alias pour accéder à l'utilisateur associé
    });

    // Relation avec le modèle Activity
    Participant.belongsTo(models.Activity, {
      foreignKey: 'activity_id',
      as: 'activity', // Alias pour accéder à l'activité associée
    });

    Participant.hasMany(models.Receipt, {
        foreignKey: 'participant_id',
        as: 'receipts',
      });
  }
}

Participant.init(
  {
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
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    first_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    date_enrolled: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'suspended'),
      defaultValue: 'active',
    },
  },
  {
    sequelize,
    modelName: 'Participant',
    tableName: 'participants',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

module.exports = Participant;
