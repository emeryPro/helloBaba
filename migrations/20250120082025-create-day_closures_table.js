'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('day_closures', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      date_closure: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        comment: 'Date de la clôture',
      },
      total_transactions: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
        comment: 'Total des transactions effectuées',
      },
      cash_balance: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
        comment: 'Solde de caisse à la fin de la journée',
      },
      approved_by: {
        type: Sequelize.INTEGER,
      
        references: {
          model: 'users', // Nom de la table des utilisateurs
          key: 'id',
        },
        allowNull: true,
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        comment: 'Utilisateur ayant approuvé la clôture',
      },
      remarks: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Remarques du Chef d\'agence',
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
