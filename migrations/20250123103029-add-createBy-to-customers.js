'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('customers', 'createBy', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'users',  // Nom de la table de référence
        key: 'id',       // Clé primaire dans la table 'users'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',  // Permet de ne pas supprimer la ligne dans 'customers' si l'utilisateur est supprimé
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
