'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const { Op } = require('sequelize');

const Participant = require('../models/Participant')
const User = require('../models/User')
const Tontine = require('../models/Tontine')
const GroupActivity = require('../models/GroupActivity')
const Activity = require('../models/Activity')


Activity.belongsTo(GroupActivity, { foreignKey: 'groupe_activity_id', as: 'gr' });

const registerParticipant = async (req, res) => {
    try {
      const { activity_id, first_name, last_name, phone, amount, frequency } = req.body;
  
      // Vérifier si l'activité appartient au groupe 'Finance et Comptabilité'
      const activity = await Activity.findByPk(activity_id, {
        include: {
          model: GroupActivity,  // Assurez-vous que la relation entre Activity et GroupActivity existe
          as: 'gr',
          where: { name: 'Finance et Comptabilité' }
        }
      });
  
      if (!activity) {
        return res.status(400).json({ message: "Activity not in the 'Finance et Comptabilité' group" });
      }
  
      // Enregistrer un nouveau participant avec `user_id` venant du middleware
      const newParticipant = await Participant.create({
        user_id: req.user.userId, // Récupéré depuis le middleware
        activity_id,
        first_name,
        last_name,
        phone,
        status: 'active', // Vous pouvez définir d'autres valeurs par défaut
        date_enrolled: new Date()
      });
  
      // Générer un numéro de carte unique pour la tontine
      const cardNumber = `TNT-${new Date().getTime()}-${Math.floor(Math.random() * 1000)}`;
  
      // Créer une tontine pour le participant
      const newTontine = await Tontine.create({
        participant_id: newParticipant.id,
        activity_id,
        card_number: cardNumber,
        amount_per_payment: amount, // Exemple d'un montant par paiement
        payment_frequency: frequency, // Exemple de fréquence de paiement
        start_date: new Date(), // Date de début de la tontine
  
      
      });
  
      // Réponse de succès avec les données du participant et de la tontine
      return res.status(201).json({
        message: "Participant and tontine registered successfully",
        participant: newParticipant,
        tontine: newTontine
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error", error: error.message });
    }
  };





  const listParticipantsByActivity = async (req, res) => {
    try {
      const { activity_id } = req.params;
  
      // Vérifier si l'activité appartient au groupe "Finance et Comptabilité"
      const activity = await Activity.findOne({
        where: { id: activity_id },
        include: {
          model: GroupActivity,
          as: 'gr',
          where: { name: 'Finance et Comptabilité' },
          attributes: ['id', 'name'], // Facultatif : Limiter les colonnes retournées
        },
      });
  
      if (!activity) {
        return res.status(404).json({ message: "Activity not found or not in 'Finance et Comptabilité' group" });
      }
  
      // Récupérer les participants liés à cette activité
      const participants = await Participant.findAll({
        where: { activity_id },
        attributes: ['id', 'first_name', 'last_name', 'phone', 'date_enrolled'],
      });
  
      return res.status(200).json({
        message: `Participants for activity ${activity_id}`,
        participants,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  };




  const listTontinesByParticipant = async (req, res) => {
    try {
      const { participant_id } = req.params;
  
      // Vérifier si le participant existe
      const participant = await Participant.findByPk(participant_id, {
        attributes: ['id', 'first_name', 'last_name', 'phone', 'status', 'date_enrolled'],
      });
  
      if (!participant) {
        return res.status(404).json({ message: 'Participant not found' });
      }
  
      // Récupérer toutes les tontines liées au participant
      const tontines = await Tontine.findAll({
        where: { participant_id },
        attributes: [
          'id',
          'card_number',
          'amount_per_payment',
          'payment_frequency',
          'start_date',
          'end_date',
          'total_contributed',
        ],
     
      });
  
      return res.status(200).json({
        message: `Tontines for participant ${participant_id}`,
        participant,
        tontines,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  








  module.exports = { 
    registerParticipant,
    listParticipantsByActivity,
    listTontinesByParticipant,
    };
