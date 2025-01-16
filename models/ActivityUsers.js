const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');  // Assure-toi de remplacer par la bonne configuration

const ActivityUser = sequelize.define('ActivityUser', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,  // La colonne 'id' sera auto-incrémentée
  },
  activity_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Activities',  // Assurez-vous que la table Activities est bien définie
      key: 'id',
    },
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',  // Assurez-vous que la table Users est bien définie
      key: 'id',
    },
  },
}, {
  tableName: 'activityuser',
  timestamps: false,  // Si tu n'as pas besoin des timestamps (createdAt, updatedAt)
});

module.exports = ActivityUser;
