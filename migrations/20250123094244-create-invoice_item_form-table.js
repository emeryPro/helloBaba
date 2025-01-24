'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('invoice_item_table', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      group_activity_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'group_activities',
          key: 'id',  
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      json: {
        type: Sequelize.JSON,
        allowNull: true,
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
