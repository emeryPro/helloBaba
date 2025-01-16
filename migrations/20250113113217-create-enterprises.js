'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('enterprises', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true, // Chaque entreprise doit avoir un nom unique
      },
      address: {
        type: Sequelize.STRING,
        allowNull: true, // Peut être facultatif
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true, // Peut être facultatif
      },
      ifu: {
        type: Sequelize.STRING,
        allowNull: true, // Peut être facultatif
        unique: true,    // Chaque entreprise doit avoir un IFU unique
      },
      rccm: {
        type: Sequelize.STRING,
        allowNull: true, // Peut être facultatif
        unique: true,    // RCCM unique pour chaque entreprise
      },
      statut_juridique: {
        type: Sequelize.STRING,
        allowNull: true, // Peut être facultatif
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW, // Par défaut, la date actuelle
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW, // Par défaut, la date actuelle
      },
    });
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.dropTable('enterprises');
    
  }
};
