'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const { Op } = require('sequelize');

const Participant = require('../models/Participant')
const User = require('../models/User')
const Tontine = require('../models/Tontine')
const GroupActivity = require('../models/GroupActivity')
const Activity = require('../models/Activity')


const registerParticipant = async (req, res) => {

    try {
      const { activity_id, first_name, last_name, phone } = req.body;

      // Vérifier si l'activité appartient au groupe 'Finance et Comptabilité'
      const activity = await Activity.findByPk(activity_id, {
        include: {
          model: GroupActivity,  // Assurez-vous que la relation entre Activity et GroupActivity existe
          where: { name: 'Finance et Comptabilité' }
        }
      });

      if (!activity) {
        return res.status(400).json({ message: "Invalid activity or activity not in the 'Finance et Comptabilité' group" });
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

      // Réponse de succès
      return res.status(201).json({
        message: "Participant registered successfully",
        participant: newParticipant
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error", error: error.message });
    }
  }