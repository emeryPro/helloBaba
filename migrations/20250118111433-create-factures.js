'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('invoices', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      tontine_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'tontines',
          key: 'id',
        },
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      participant_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'participants',
          key: 'id',
        },
        allowNull: false,
      },
      amount_due: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      due_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('paid', 'unpaid', 'overdue'),
        defaultValue: 'unpaid',
      },
      payment_date: {
        type: Sequelize.DATE,
        allowNull: true, // Peut être null si non payé
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
