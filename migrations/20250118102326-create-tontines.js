'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Tontines', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      participant_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Participants',
          key: 'id',
        },
        allowNull: false,
      },
      activity_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'activities',
          key: 'id',  
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      card_number: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      amount_per_payment: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      payment_frequency: {
        type: Sequelize.ENUM('daily', 'weekly', 'monthly', 'quarterly'),
        allowNull: false,
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      end_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      total_contributed: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.00,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
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
