'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('receipts', 'user_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users', // Nom de la table référencée
        key: 'id', // Clé primaire de la table référencée
      },
      onUpdate: 'CASCADE', // Met à jour si l'id de l'utilisateur change
      onDelete: 'CASCADE', // Supprime les reçus si l'utilisateur est supprimé
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
