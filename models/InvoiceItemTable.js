// models/invoiceItemTable.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Chemin vers ta configuration Sequelize

class InvoiceItemTable extends Model {
  static associate(models) {
    // Définir les relations entre cette table et d'autres modèles
    // Par exemple : 
    // InvoiceItemTable.belongsTo(models.GroupActivity, { foreignKey: 'group_activity_id' });
  }
}

InvoiceItemTable.init(
  {
    group_activity_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'group_activities', // Table associée
        key: 'id', // Clé primaire dans la table `group_activities`
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    json: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'InvoiceItemTable', // Nom du modèle
    tableName: 'invoice_item_table', // Nom réel de la table dans la base de données
    timestamps: false, // Pas besoin de createdAt/updatedAt pour cette table
  }
);

module.exports = InvoiceItemTable;
