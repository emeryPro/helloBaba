'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('permissions', [
      { description: 'Ajout client', createdAt: new Date(), updatedAt: new Date() },
      { description: 'Voir client', createdAt: new Date(), updatedAt: new Date() },
      { description: 'Enregistrer un payement', createdAt: new Date(), updatedAt: new Date() },
      { description: 'Enregistrer une facture', createdAt: new Date(), updatedAt: new Date() },
      { description: 'Cloturer journer', createdAt: new Date(), updatedAt: new Date() },
      { description: 'Voir facture', createdAt: new Date(), updatedAt: new Date() },
      { description: 'Voir payement', createdAt: new Date(), updatedAt: new Date() },
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
