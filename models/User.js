// models/user.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 

class User extends Model {
  static associate(models) {
    User.belongsTo(models.Role, {
      foreignKey: 'role_id', // Clé étrangère dans User
      as: 'role', // Alias pour accéder au rôle associé
    });
   // Relation avec le modèle Enterprise
   User.belongsTo(models.Enterprise, {
    foreignKey: 'enterprise_id',  // Clé étrangère dans User
    as: 'enterprise',  // Alias pour accéder à l'entreprise associée
  });

 
  User.hasMany(models.Activity, {
    foreignKey: 'user_id',
    as: 'activities', // Alias pour accéder aux activités associées
  });

  User.hasMany(models.Token, {
    foreignKey: 'user_id', // Clé étrangère dans le modèle Token
    as: 'tokens',          // Alias pour accéder aux tokens associés
  });
  

  User.belongsToMany(Activity, {
    through: 'activityuser',
    foreignKey: 'user_id',
    as: 'userActivities',
  });
  
  }
}


User.init(
  {
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phonenumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mail: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role_id: {
      type: DataTypes.INTEGER, // Clé étrangère
      allowNull: false,
      references: {
        model: 'roles', // Nom de la table cible
        key: 'id', // Clé primaire dans la table `Roles`
      },
      onUpdate: 'CASCADE', // Mise à jour en cascade
      onDelete: 'SET NULL', // Définit la valeur à NULL si le rôle est supprimé
    },
    enterprise_id: {
      type: DataTypes.INTEGER, // Clé étrangère
      allowNull: true,
      references: {
        model: 'enterprises', // Nom de la table cible
        key: 'id', // Clé primaire dans la table `Enterprises`
      },
      onUpdate: 'CASCADE', // Mise à jour en cascade
      onDelete: 'SET NULL', // Définit la valeur à NULL si l'entreprise est supprimée
    },

  },
  {
    sequelize,
    modelName: 'User',
  }
);

module.exports = User;
