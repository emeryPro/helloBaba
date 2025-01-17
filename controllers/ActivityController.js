'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const { Op } = require('sequelize');



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
/* Role.associate({ User }); */
/* User.associate({ Role }); */

User.belongsTo(Role, { foreignKey: 'role_id', as: 'role' });







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



  

const getActivityUserCount = async (req, res) => {
  try {
    const userId = req.user.userId;  // Supposons que l'ID de l'utilisateur soit extrait du token (authentification)

    // Étape 1 : Chercher tous les activity_id liés à l'utilisateur connecté
    const userActivities = await ActivityUser.findAll({
      where: { user_id: userId },
      attributes: ['activity_id'],  // On ne récupère que les activity_id pour cet utilisateur
    });

    if (!userActivities || userActivities.length === 0) {
      return res.status(404).json({ message: 'Aucune activité trouvée pour cet utilisateur.' });
    }

    // Extraire les IDs des activités
    const activityIds = userActivities.map(activity => activity.activity_id);

    // Étape 2 : Chercher les user_id pour chaque activity_id
    const activityCounts = await ActivityUser.findAll({
      where: {
        activity_id: {
          [Op.in]: activityIds,  // Cherche les user_id associés aux activity_id récupérés
        },
      },
      attributes: ['activity_id', [sequelize.fn('COUNT', sequelize.col('user_id')), 'userCount']],  // Compter les user_id pour chaque activity_id
      group: ['activity_id'],  // Grouper par activity_id pour compter le nombre d'utilisateurs pour chaque activité
    });

    // Étape 3 : Retourner les résultats
    if (activityCounts.length === 0) {
      return res.status(404).json({ message: 'Aucun utilisateur trouvé pour ces activités.' });
    }

    return res.status(200).json({
      message: 'Comptage des utilisateurs par activité récupéré avec succès.',
      activityCounts,  // Ce sera un tableau d'objets avec l'activity_id et le nombre d'utilisateurs
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs par activité:', error);
    return res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
};



const deleteActivity = async (req, res) => {
  try {
    const activityId = req.params.id;

    // Vérifier d'abord si l'activité existe
    const activity = await Activity.findByPk(activityId);
    if (!activity) {
      return res.status(404).json({ message: 'Activité non trouvée.' });
    }

    // Supprimer l'activité elle-même (les références dans d'autres tables seront supprimées en cascade)
    await activity.destroy();

    return res.status(200).json({ message: 'Activité supprimée avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'activité:', error);
    return res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
};





const showActivities = async (req, res) => {
  try {
    const activityId = req.params.id;  // L'ID de l'activité passé dans l'URL

    // Vérifier si l'activité existe
    const activity = await Activity.findByPk(activityId);
    if (!activity) {
      return res.status(404).json({ message: 'Activité non trouvée.' });
    }

    // Récupérer tous les utilisateurs associés à cette activité
    const activityUsers = await ActivityUser.findAll({
      where: { activity_id: activityId },
      attributes: ['user_id'],  // Récupérer seulement les user_id
    });

    // Si aucun utilisateur n'est associé à l'activité
    if (!activityUsers || activityUsers.length === 0) {
      return res.status(404).json({ message: 'Aucun utilisateur associé à cette activité.' });
    }

    // Récupérer les détails des utilisateurs associés à l'activité
    const userIds = activityUsers.map(user => user.user_id);  // Extraire les user_id des résultats de ActivityUser
    const users = await User.findAll({
      where: { id: userIds },
      attributes: ['id',  'lastname', 'firstname','mail','phonenumber'],
      include: [
        {
          model: Role,
          as: 'role',  // Récupérer le rôle associé à l'utilisateur
          attributes: ['name'],  // On ne récupère que le nom du rôle
        }
      ],
        // Récupérer les informations des utilisateurs
    });

    // Retourner les informations de l'activité et des utilisateurs associés
    return res.status(200).json({
      activity: {
        id: activity.id,
        name: activity.name,
        description: activity.description,
        // Ajouter d'autres informations si nécessaire
      },
      users: users.map(user => ({
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        phonenumber: user.phonenumber,
        mail: user.mail,
        role: user.role.name,  // Nom du rôle de l'utilisateur
      })),
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des activités:', error);
    return res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
};






module.exports = { createActivity, getUserActivities, getActivityUserCount, deleteActivity, showActivities };






























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