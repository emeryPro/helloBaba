'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('group_activities', [
      { name: 'Agriculture et Élevage', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Construction et Immobilier', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Transport et Logistique', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Commerce et Vente', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Prestations de Services', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Santé et Bien-être', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Éducation et Formation', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Restauration et Hôtellerie', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Finance et Comptabilité', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Technologie et Développement', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Art et Divertissement', createdAt: new Date(), updatedAt: new Date() },
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
