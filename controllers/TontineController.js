
const Tontine = require('../models/Tontine')
const Participant = require('../models/Participant')
const Receipt = require('../models/Receipt')



const getTontineDetails = async (req, res) => {
    try {
      // Récupérer l'ID ou le numéro de carte depuis les paramètres ou le corps de la requête
      const { tontine_id, card_number } = req.params;
  
      let tontine;
  
      // Recherche de la tontine soit par ID, soit par card_number
      if (tontine_id) {
        tontine = await Tontine.findByPk(tontine_id);
      } else if (card_number) {
        tontine = await Tontine.findOne({
          where: { card_number },
        });
      }
  
      if (!tontine) {
        return res.status(404).json({ message: 'Tontine introuvable.' });
      }
  
      // Récupérer les participants associés à la tontine
      const participants = await Participant.findAll({
        where: { id: tontine.participant_id },
      });
  
      // Récupérer tous les paiements associés à la tontine
      const payments = await Receipt.findAll({
        where: { 
            tontine_id: tontine.id,
            payment_status: 'paid',
         },
        order: [['receipt_date', 'ASC']], // Trier par date croissante
      });
  
      // Calculer le "nombre de paiements" pour chaque paiement
      let cumulativePayments = 0; // Somme cumulative des paiements
      const paymentsWithDetails = payments.map((payment, index) => {
        cumulativePayments += parseFloat(payment.amount_paid); // Ajouter le paiement courant
  
        // Déterminer le terme de fréquence
        let term;
        switch (tontine.payment_frequency) {
          case 'daily':
            term = `jour ${index + 1}`;
            break;
          case 'weekly':
            term = `semaine ${index + 1}`;
            break;
          case 'monthly':
            term = `mois ${index + 1}`;
            break;
          default:
            term = `période ${index + 1}`;
        }
  
        return {
          ...payment.toJSON(),
          cumulative_payments: cumulativePayments, // Somme des paiements jusqu'à maintenant
          payment_term: term, // Nombre de jour/semaine/mois
        };
      });
  
      // Réponse JSON avec toutes les informations
      return res.status(200).json({
        tontine,
        participants,
        payments: paymentsWithDetails,
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des détails de la tontine :', error);
      return res.status(500).json({
        message: 'Une erreur est survenue lors de la récupération des détails de la tontine.',
        error: error.message,
      });
    }
  };
  
  module.exports = { getTontineDetails };