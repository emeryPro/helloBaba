
const Customer = require('../models/Customers')
const Activity = require('../models/Activity')
const User = require('../models/User')
const jwt = require('jsonwebtoken');

const createCustomer = async (req, res) => {
  try {
    // Vérifier que toutes les informations nécessaires sont présentes dans le corps de la requête
    const { activity_id, first_name, last_name, phonenumber, address } = req.body;

    if (!activity_id || !first_name || !last_name || !phonenumber || !address) {
      return res.status(400).json({ message: 'Tous les champs sont obligatoires (activity_id, first_name, last_name, address).' });
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
        return res.status(400).json({ message: 'Les champs first_name et last_name sont obligatoires.' });
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



module.exports = { createCustomer, updateCustomer, deleteCustomer };
