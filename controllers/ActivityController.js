'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');




const  GroupActivity  = require('../models/GroupActivity');
const  Role  = require('../models/Role'); 
const  User  = require('../models/User');


const  Activity  = require('../models/Activity'); // Assurez-vous que le modèle d'Activité est bien importé
const ActivityUser = require('../models/ActivityUsers')





/* Activity.associate({ User }); */
 
    /*  Activity.associate({ GroupActivity }); */   
/* GroupActivity.associate({ Activity });  */

// Configurer les associations
Activity.belongsTo(GroupActivity, { foreignKey: 'groupe_activity_id', as: 'grou' });
GroupActivity.hasMany(Activity, { foreignKey: 'groupe_activity_id', as: 'activities' });











const createActivity = async (req, res) => {
  try {
    // Vérifier que l'utilisateur connecté est un "Director"
    const userId = req.user.userId;
    const roleId = req.user.role;

    // Récupérer le rôle de l'utilisateur en fonction de son ID
    const role = await Role.findByPk(roleId);

    if (!role || role.name !== 'Director') {
      return res.status(403).json({ message: 'Accès interdit. Seul un Directeur peut créer une activité.' });
    }

    // Logique pour créer l'activité
    // Par exemple, ici on pourrait utiliser `req.body` pour les données de l'activité
    const { name, groupe_activity_id } = req.body;

    if (!name || !groupe_activity_id) {
        return res.status(400).json({ message: 'Tous les champs sont obligatoires.' });
      }
    
    const activity = await Activity.create({
      name,
      groupe_activity_id,
      user_id: userId,
    });

      // Ajouter l'utilisateur (DG) à la table de jonction
      await ActivityUser.create({
        activity_id: activity.id,
        user_id: userId,  // Lier l'activité à l'utilisateur DG
      });

    return res.status(201).json({
      message: 'Activité créée avec succès.',
      activity,
    });

  } catch (error) {
    console.error('Erreur lors de la création de l\'activité:', error);
    return res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
};





const getUserActivities = async (req, res) => {
    try {
      const userId = req.user.userId;  // L'ID de l'utilisateur connecté
  
      // Vérifier si l'utilisateur existe dans la table activityuser (table de liaison)
      const userActivities = await ActivityUser.findAll({
        where: { user_id: userId },  // On cherche les activités liées à l'utilisateur
        attributes: ['activity_id'],  // On ne récupère que les ids des activités
      });
  
      if (!userActivities || userActivities.length === 0) {
        return res.status(404).json({ message: 'Aucune activité trouvée pour cet utilisateur.' });
      }
  
      // Extraire les IDs des activités
      const activityIds = userActivities.map(activityUser => activityUser.activity_id);
      
      
      // Récupérer les activités associées à ces IDs
      const activities = await Activity.findAll({
        where: {
          id: activityIds,  // On filtre les activités par leurs IDs
        },
       include: [
            {
              model: GroupActivity,
              as: 'grou', 
              
            },
          ],  
       
      });
  
      if (activities.length === 0) {
        return res.status(404).json({ message: 'Aucune activité trouvée avec ces ID.' });
      }
  
      // Retourner les activités sous forme de réponse JSON
      return res.status(200).json({
        message: 'Activités récupérées avec succès.',
        activities,
      });
  
    } catch (error) {
      console.error('Erreur lors de la récupération des activités:', error);
      return res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
  };







module.exports = { createActivity, getUserActivities };






























/* const  Activity  = require('../models'); // Assurez-vous que le modèle d'Activité est bien importé
const { validateToken } = require('../middlewares/validateToken'); // Importer le middleware de validation du token

const createActivity = async (req, res) => {
  try {
    // Vérifier si l'utilisateur a le rôle de "Director"
    if (req.user.role !== 'Director') {
      return res.status(403).json({ message: 'Accès interdit. Seul un Directeur peut créer une activité.' });
    }

    const { name, groupe_activity_id, user_id } = req.body;

    // Valider que les données nécessaires sont présentes
    if (!name || !groupe_activity_id || !user_id) {
      return res.status(400).json({ message: 'Veuillez fournir tous les champs nécessaires (name, groupe_activity_id, user_id).' });
    }

    // Créer l'activité
    const activity = await Activity.create({
      name,
      groupe_activity_id,
      user_id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return res.status(201).json({
      message: 'Activité créée avec succès.',
      activity,
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'activité:', error);
    return res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
};

module.exports = { createActivity };
 */