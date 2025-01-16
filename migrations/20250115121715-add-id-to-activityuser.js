'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('activityuser', 'id', {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,  // La colonne 'id' sera auto-incrémentée
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
