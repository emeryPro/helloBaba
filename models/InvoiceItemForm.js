// models/invoice_item_form.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class InvoiceItemForm extends Model {
  static associate(models) {
    // Relation avec le modèle GroupActivity
    InvoiceItemForm.belongsTo(models.GroupActivity, {
      foreignKey: 'group_activity_id',
      as: 'groupActivity', // Alias pour accéder au groupe d'activité associé
    });
  }
}

InvoiceItemForm.init(
  {
    structure: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    groupe_activity_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'group_activities', // Nom de la table des groupes d'activité
        key: 'id', // Clé primaire de la table `group_activities`
      },
      onDelete: 'CASCADE',
    },
  },
  {
    sequelize,
    modelName: 'InvoiceItemForm',
    tableName: 'invoice_item_forms',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  }
);

module.exports = InvoiceItemForm;
