'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      lastname: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      firstname: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      phonenumber: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      mail: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      role_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'roles', // Le nom de la table `Roles` que vous avez créée
          key: 'id', // La clé primaire de la table `Roles`
        },
        onUpdate: 'CASCADE', // Mise à jour en cascade si l'ID du rôle est modifié
        onDelete: 'SET NULL', // Si un rôle est supprimé, la valeur de `roleId` sera définie sur NULL
      },
      enterprise_id: {
        type: Sequelize.INTEGER,
        allowNull: true, // Laisser `allowNull` à `true` si vous souhaitez qu'il puisse être nul
        references: {
          model: 'enterprises', // Le nom de la table à laquelle `enterpriseId` fait référence
          key: 'id', // La clé primaire de la table `Enterprises`
        },
        onUpdate: 'CASCADE', // Mise à jour en cascade si l'ID de l'entreprise est modifié
        onDelete: 'SET NULL', // Si l'entreprise est supprimée, la valeur de `enterpriseId` sera définie sur NULL
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};
