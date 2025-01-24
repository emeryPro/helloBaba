'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('invoice_item_forms', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      structure: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      groupe_activity_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'group_activities', // Nom de la table de référence
          key: 'id', // Clé primaire dans la table `group_activities`
        },
        onDelete: 'CASCADE', // Supprimer les enregistrements liés si le groupe d'activité est supprimé
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
