'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('receipts', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      payment_reference: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      tontine_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'tontines',
          key: 'id',
        },
        allowNull: false,
      },
      invoice_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'invoices',
          key: 'id',
        },
        allowNull: false,
      },
      participant_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'participants',
          key: 'id',
        },
        allowNull: false,
      },
      amount_paid: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      receipt_date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      payment_status: {
        type: Sequelize.ENUM('paid', 'unpaid'),
        defaultValue: 'paid',
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
