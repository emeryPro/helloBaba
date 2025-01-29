'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Roles', [
      {
        name: 'Admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Directeur',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Secretaire',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Caissier',
        createdAt: new Date(),
        updatedAt: new Date(),
      },{
        name: 'Chef Agence',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
