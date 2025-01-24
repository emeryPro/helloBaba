// controllers/settingController.js
const  Setting  = require('../models/Setting'); // Charger le modèle Setting

const updateOrCreateSetting = async (req, res) => {
  const { activity_id, isRequireTva, isRequireRegisterCustomers } = req.body;

  try {
    // Vérifier si une ligne existe déjà pour l'activity_id donné
    let setting = await Setting.findOne({ where: { activity_id } });

    if (!setting) {
      // Si la ligne n'existe pas, la créer
      setting = await Setting.create({
        activity_id,
        tva: isRequireTva,
        client: isRequireRegisterCustomers,
      });
      return res.status(201).json({
        message: 'La configuration a été créée avec succès.',
        setting,
      });
    } else {
      // Si la ligne existe, la mettre à jour
      await setting.update({
        tva: isRequireTva,
        client: isRequireRegisterCustomers,
      });
      return res.status(200).json({
        message: 'La configuration a été mise à jour avec succès.',
        setting,
      });
    }
  } catch (error) {
    console.error('Erreur lors de la gestion des paramètres :', error);
    return res.status(500).json({
      message: 'Une erreur est survenue lors de la gestion des paramètres.',
      error: error.message,
    });
  }
};

module.exports = {
  updateOrCreateSetting,
};
