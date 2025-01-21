'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('tontines', 'duration', {
      type: Sequelize.INTEGER,
      allowNull: false, // Si ce champ est requis, sinon mettez `true`
      defaultValue: 0,  // Vous pouvez définir une valeur par défaut
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
