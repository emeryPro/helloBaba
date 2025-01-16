'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('ActivityUser', {
      activity_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Activities', // Assurez-vous que le modèle Activities existe déjà
          key: 'id',
        },
        onDelete: 'CASCADE', // Si une activité est supprimée, ses associations sont supprimées
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Users', // Assurez-vous que le modèle Users existe déjà
          key: 'id',
        },
        onDelete: 'CASCADE', // Si un utilisateur est supprimé, ses associations sont supprimées
      },
   
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
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
