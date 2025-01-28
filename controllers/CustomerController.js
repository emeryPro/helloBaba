
const Customer = require('../models/Customers')
const Activity = require('../models/Activity')
const Invoice = require('../models/Invoice')
const User = require('../models/User')
const InvoiceItem = require('../models/InvoiceItem')
const jwt = require('jsonwebtoken');

const createCustomer = async (req, res) => {
  try {
    // Vérifier que toutes les informations nécessaires sont présentes dans le corps de la requête
    const { activity_id, first_name, last_name, phonenumber, address } = req.body;

    if (!activity_id || !first_name || !last_name || !phonenumber || !address) {
      return res.status(400).json({ message: 'Tous les champs sont obligatoires.' });
    }

    const userId = req.user.userId;

    // Vérifier si l'activité associée existe
    const activity = await Activity.findOne({ where: { id: activity_id } });
    if (!activity) {
      return res.status(404).json({ message: `Aucune activité trouvée avec l'ID ${activity_id}.` });
    }

    // Créer un nouveau client
    const newCustomer = await Customer.create({
      activity_id,       // L'activité à laquelle appartient ce client
      first_name,        // Prénom du client
      last_name,         // Nom de famille du client
      phonenumber,       // Numéro de téléphone du client (peut être optionnel)
      createBy: userId, // ID de l'utilisateur qui crée le client, récupéré depuis le token
      address,
    });

    // Retourner une réponse positive
    return res.status(201).json({ message: 'Client créé avec succès.', customer: newCustomer });

  } catch (error) {
    console.error('Erreur lors de la création du client:', error);
    return res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
};





const updateCustomer = async (req, res) => {
    try {
      // Récupérer l'ID du client à mettre à jour à partir des paramètres de la requête
      const { id } = req.params;
  
      // Récupérer les nouvelles données du client à partir du corps de la requête
      const {  first_name, last_name, phonenumber, address } = req.body;
  
      // Vérification des données nécessaires
      if (!first_name || !last_name) {
        return res.status(400).json({ message: 'Les champs sont obligatoires.' });
      }
  
      // Vérifier si le client existe dans la base de données
      const customer = await Customer.findByPk(id);
      if (!customer) {
        return res.status(404).json({ message: `Client avec l'ID ${id} non trouvé.` });
      }
  
  
      // Mettre à jour les informations du client
      const updatedCustomer = await customer.update({
      
        first_name,
        last_name,
        phonenumber: phonenumber || customer.phonenumber, // Si phonenumber est fourni, on le met à jour
        address,
      });
  
      // Retourner une réponse avec les nouvelles informations du client
      return res.status(200).json({ message: 'Client mis à jour avec succès.', customer: updatedCustomer });
  
    } catch (error) {
      console.error('Erreur lors de la mise à jour du client:', error);
      return res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
  };

  const deleteCustomer = async (req, res) => {
    try {
      // Récupérer l'ID du client à supprimer à partir des paramètres de la requête
      const { id } = req.params;
      const userId = req.user.userId;
      // Vérifier si le client existe dans la base de données
      const customer = await Customer.findByPk(id);
      if (!customer) {
        return res.status(404).json({ message: `Client avec l'ID ${id} non trouvé.` });
      }
  
    
      // Vérifier si l'utilisateur qui effectue la suppression est le même que celui ayant créé le client (optionnel)
      if (userId !== customer.createBy) {
        return res.status(403).json({ message: 'Vous n\'êtes pas autorisé à supprimer ce client.' });
      }
  
      // Supprimer le client
      await customer.destroy();
  
      // Retourner une réponse indiquant que le client a été supprimé avec succès
      return res.status(200).json({ message: 'Client supprimé avec succès.' });
  
    } catch (error) {
      console.error('Erreur lors de la suppression du client:', error);
      return res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
  };







const getCustomersByActivityId = async (req, res) => {
  try {
    const { activity_id } = req.params; // Récupère l'ID de l'activité à partir des paramètres de la requête

    // Vérifie si l'activité existe (facultatif, mais recommandé)
    const activity = await Activity.findByPk(activity_id);
    if (!activity) {
      return res.status(404).json({ message: "L'activité spécifiée n'existe pas." });
    }

    // Récupère tous les clients associés à l'activité
    const customers = await Customer.findAll({
      where: { activity_id }, // Filtrer par l'ID d'activité
      attributes: ['id', 'last_name', 'first_name', 'phonenumber', 'address', 'createdAt', 'updatedAt'], // Champs spécifiques à retourner
  
    });

    // Vérifie si des clients ont été trouvés
    if (!customers || customers.length === 0) {
      return res.status(404).json({ message: "Aucun client trouvé pour cette activité." });
    }

    // Retourne les clients trouvés
    res.status(200).json(customers);
  } catch (error) {
    console.error("Erreur lors de la récupération des clients :", error);
    res.status(500).json({ message: "Une erreur est survenue lors de la récupération des clients.", error });
  }
};





const getCustomerDetailsById = async (req, res) => {
  try {
    const { id } = req.params; // Récupère l'ID du client depuis les paramètres de la requête

    // Étape 1 : Récupérer les informations du client
    const customer = await Customer.findByPk(id, {
      attributes: ['id', 'last_name', 'first_name', 'phonenumber', 'address', 'createdAt', 'updatedAt'], // Champs spécifiques à retourner
    });

    if (!customer) {
      return res.status(404).json({ message: "Client introuvable." });
    }

    // Étape 2 : Récupérer les factures associées au client
    const invoices = await Invoice.findAll({
      where: { customers_id: id }, // Filtrer par le client ID
      attributes: ['id', 'facturenumber', 'customers_id', 'activity_id', 'statut','createdAt', 'updatedAt'], // Champs spécifiques des factures
    });

    // Si aucune facture n'est trouvée
    if (!invoices || invoices.length === 0) {
      return res.status(200).json({
        customer,
        invoices: [],
        message: "Aucune facture trouvée pour ce client.",
      });
    }

    // Étape 3 : Pour chaque facture, récupérer les articles de facture
    const invoicesWithItems = await Promise.all(
      invoices.map(async (invoice) => {
        const invoiceItems = await InvoiceItem.findAll({
          where: { invoice_id: invoice.id },
          attributes: ['id',  'json', 'invoice_id'], // Champs spécifiques des articles de facture
        });

        return {
          ...invoice.toJSON(), // Inclure les données de la facture
          items: invoiceItems, // Ajouter les articles de facture
        };
      })
    );

    // Réponse avec les informations du client, des factures et des articles
    res.status(200).json({
      customer,
      invoices: invoicesWithItems,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des informations du client :", error);
    res.status(500).json({
      message: "Une erreur est survenue lors de la récupération des informations du client.",
      error: error.message,
    });
  }
};








module.exports = { createCustomer, updateCustomer, getCustomersByActivityId, deleteCustomer, getCustomerDetailsById };
