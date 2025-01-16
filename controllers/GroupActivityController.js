const  GroupActivity  = require('../models/GroupActivity'); // Assurez-vous que vous avez bien importé le modèle 'GroupActivity'

const getGroupActivities = async (req, res) => {
  try {
    // Récupérer tous les groupes d'activités dans la base de données
    const groupActivities = await GroupActivity.findAll();

    // Vérifier si des groupes d'activités existent
    if (groupActivities.length === 0) {
      return res.status(404).json({ message: 'Aucun groupe d\'activités trouvé.' });
    }

    // Répondre avec les groupes d'activités récupérés
    return res.status(200).json({
      message: 'Groupes d\'activités récupérés avec succès.',
      data: groupActivities,
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des groupes d\'activités:', error);
    return res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
};

module.exports = { getGroupActivities };
