
const sequelize = require('../config/db');
const Invoice = require('../models/Invoice')
const InvoiceItem = require('../models/InvoiceItem')
const Activity = require('../models/Activity')
const Customer = require('../models/Customers')
const generateInvoiceNumber = require('../utils/generateInvoiceNumber')
const InvoiceItemForm = require('../models/InvoiceItemForm')
const jwt = require('jsonwebtoken');


Invoice.belongsTo(Customer, { foreignKey: 'customers_id', as: 'invoiceCustomer' });
Invoice.belongsTo(Activity, { foreignKey: 'activity_id', as: 'invoiceActivity' });
InvoiceItem.belongsTo(Invoice, { foreignKey: 'invoice_id', as: 'invoiceItem' });
Invoice.hasMany(InvoiceItem, { foreignKey: 'invoice_id', as: 'invoiceItem' });
const createInvoice = async (req, res) => {
    const t = await sequelize.transaction(); // Transaction pour garantir la cohérence des données
  
    try {
      // Récupérer les données envoyées par le frontend
      const { activity_id, customer_id, items } = req.body; // items est un tableau d'objets { designation, json }
  
      // Vérification si l'activité existe
      const activity = await Activity.findByPk(activity_id);
      if (!activity) {
        return res.status(404).json({ message: 'Activité non trouvée.' });
      }
  
      // Récupérer le group_activity_id à partir de l'activité
      const group_activity_id = activity.groupe_activity_id;
  
      // Si customer_id est envoyé, on récupère le client associé
      let customer = null;
      if (customer_id) {
        customer = await Customer.findByPk(customer_id);
        if (!customer) {
          return res.status(404).json({ message: 'Client non trouvé.' });
        }
      }
  
      const userId = req.user.userId;
  
      // Créer la facture
      const invoiceNumber = await generateInvoiceNumber(); // Générer un numéro de facture
      const newInvoice = await Invoice.create(
        {
          facturenumber: invoiceNumber,
          statut: 'Pending', // Statut initial de la facture
          customers_id: customer ? customer.id : null, // Si un client est fourni
          activity_id: activity.id,
          group_activity_id: group_activity_id,
          createBy: userId,
        },
        { transaction: t }
      );
  
      // Ajouter les items à la facture
      const invoiceItems = items.map(item => ({
        designation: 'p',
        json: item.json,
        invoice_id: newInvoice.id,
      }));
  
      // Créer les items associés à la facture dans InvoiceItem
      await InvoiceItem.bulkCreate(invoiceItems, { transaction: t });
  
      // Commit la transaction
      await t.commit();
  
      // Retourner la facture créée avec les items associés
      return res.status(201).json({
        message: 'Facture et items créés avec succès.',
        invoice: newInvoice,
        items: invoiceItems,
      });
    } catch (error) {
      // Si une erreur survient, annuler la transaction
      await t.rollback();
      console.error(error);
      return res.status(500).json({ message: 'Erreur lors de la création de la facture.' });
    }
  };



  const getInvoiceDetails = async (req, res) => {
    const { id } = req.params; // L'ID de la facture passé dans l'URL
  
    try {
      // Récupérer la facture avec les relations associées
      const invoice = await Invoice.findOne({
        where: { id },
        include: [
          {
            model: Customer, // Inclure le client associé à la facture
            as: 'invoiceCustomer', // Alias pour la relation avec Customer
            attributes: ['id', 'first_name', 'last_name', 'phonenumber','address'], // Attributs du client
            required: false, // Client facultatif, même si non associé
          },
          {
            model: Activity, // Inclure l'activité associée à la facture
            as: 'invoiceActivity',
            attributes: ['id', 'name'], // Attributs de l'activité
            required: true, // Activité obligatoire
          },
          {
            model: InvoiceItem, // Inclure les items associés
            as: 'invoiceItem', // Alias pour la relation avec InvoiceItem
            attributes: ['id',  'json'], // Attributs des items
            required: false, // Items facultatifs
          },
        ],
      });
  
      // Vérifier si la facture existe
      if (!invoice) {
        return res.status(404).json({ message: 'Facture non trouvée.' });
      }
  
      // Retourner les informations de la facture avec ses relations
      return res.status(200).json({
        message: 'Facture trouvée avec succès.',
        invoice,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erreur lors de la récupération de la facture.' });
    }
  };
  



  const getInvoicesByActivityAndStatus = async (req, res) => {
    try {
      const { activity_id, statut } = req.params;
  
      // Interpréter le statut (true => "paid", false => "unpaid")
     /*  const invoiceStatus = (statut === 'true' || statut === '1') ? 'paid' : 'pending'; */

     let invoiceStatusCondition = {};
     if (statut !== undefined) {
       const invoiceStatus = (statut === 'true' || statut === '1') ? 'paid' : 'pending';
       invoiceStatusCondition = { statut: invoiceStatus };
     }
  
      // Étape 1: Récupérer les factures liées à l'activité et au statut donné
      const invoices = await Invoice.findAll({
        where: { activity_id, 
         /*  statut: invoiceStatus */
         ...invoiceStatusCondition,
        },
        include: [
          {
            model: Customer,
            as: 'invoiceCustomer',
            attributes: ['id', 'first_name', 'last_name', 'phonenumber','address'], // Champs spécifiques pour le client
            required: false,
          },
        ],
      });
  
      // Vérifier si des factures existent
      if (!invoices || invoices.length === 0) {
        return res.status(404).json({ message: "Aucune facture trouvée pour cette activité et ce statut." });
      }
  
      // Étape 2: Récupérer les items associés à chaque facture
      const invoiceDetails = await Promise.all(
        invoices.map(async (invoice) => {
          const invoiceItems = await InvoiceItem.findAll({
            where: { invoice_id: invoice.id },
            attributes: ['id', 'designation', 'json'], // Champs spécifiques pour les items
          });
  
          return {
            invoice: {
              id: invoice.id,
              facturenumber: invoice.facturenumber,
              statut: invoice.statut,
              customer: invoice.invoiceCustomer,
              createdAt: invoice.createdAt,
              updatedAt: invoice.updatedAt,
            },
            invoiceItems,
          };
        })
      );
  
      // Retourner les résultats
      res.status(200).json(invoiceDetails);
    } catch (error) {
      console.error('Erreur lors de la récupération des factures :', error);
      res.status(500).json({ message: 'Une erreur est survenue.', error });
    }
  };
  



  const getFormStructureByActivityId = async (req, res) => {
    const { activityId } = req.params;
  
    try {
      // Étape 1 : Vérifier si l'activité existe et récupérer son group_activity_id
      const activity = await Activity.findOne({
        where: { id: activityId },
        attributes: ['groupe_activity_id'], // On récupère uniquement group_activity_id
      });
  
      if (!activity) {
        return res.status(404).json({ message: "Activité non trouvée." });
      }
  
      const groupActivityId = activity.groupe_activity_id;
  
      // Étape 2 : Utiliser group_activity_id pour récupérer la structure du formulaire
      const invoiceItemForm = await InvoiceItemForm.findOne({
        where: { groupe_activity_id: groupActivityId },
        attributes: ['structure'], // On récupère uniquement la structure
      });
  
      if (!invoiceItemForm) {
        return res.status(404).json({ message: "Structure de formulaire non trouvée pour ce groupe d'activités." });
      }
  
      // Étape 3 : Retourner la structure de formulaire
      return res.status(200).json({
        message: "Structure de formulaire récupérée avec succès.",
        data:/*  JSON.parse( */invoiceItemForm.structure/* ) */, // Convertir le JSON stocké en objet JS
      });
    } catch (error) {
      console.error("Erreur lors de la récupération de la structure de formulaire :", error);
      return res.status(500).json({ message: "Erreur serveur." });
    }
  };







module.exports = { createInvoice, getInvoiceDetails, getInvoicesByActivityAndStatus, getFormStructureByActivityId };
