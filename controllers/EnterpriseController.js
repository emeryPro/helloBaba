
const  Enterprise  = require('../models/Enterprise');
const  User  = require('../models/User'); // Importez les modèles nécessaires
// Fonction pour créer une entreprise
// Connecter les relations manuellement
Enterprise.associate({ User });
/* User.associate({ Enterprise }); */
const createEnterprise = async (req, res) => {
  try {
    const { name, address, phone, ifu, rccm, statut_juridique, userId } = req.body;

  

    // Vérification des données d'entrée
    if (!name || !address || !phone || !ifu || !rccm || !statut_juridique) {
      return res.status(400).json({ message: 'Tous les champs sont obligatoires.' });
    }

    // Création de l'entreprise
    const newEnterprise = await Enterprise.create({
      name,
      address,
      phone,
      ifu,
      rccm,
      statut_juridique,
    });

    // Mettre à jour l'utilisateur qui a créé l'entreprise en ajoutant l'`enterpriseId`
    await User.update(
      { enterprise_id: newEnterprise.id },
      { where: { id: userId } } // Met à jour uniquement l'utilisateur authentifié
    );

    return res.status(201).json({ message: 'Entreprise créée avec succès.', enterprise: newEnterprise });
  } catch (error) {
    console.error('Erreur lors de la création de l’entreprise:', error);
    return res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
};

// Fonction pour récupérer une entreprise par son ID
const getEnterpriseById = async (req, res) => {
  try {
    const { enterpriseId } = req.params;

    // Recherche de l'entreprise par son ID
    const enterprise = await Enterprise.findOne({
      where: { id: enterpriseId },
      include: {
        model: User,
        as: 'users', // Inclure les utilisateurs associés
        attributes: ['id', 'firstname', 'lastname', 'mail'], // Sélectionner les attributs que vous voulez afficher
      },
    });

    if (!enterprise) {
      return res.status(404).json({ message: 'Entreprise non trouvée.' });
    }

    return res.status(200).json({ enterprise });
  } catch (error) {
    console.error('Erreur lors de la récupération de l’entreprise:', error);
    return res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
};

// Fonction pour mettre à jour les informations d'une entreprise
const updateEnterprise = async (req, res) => {
  try {
    const { enterpriseId } = req.params;
    const { name, address, phone, ifu, rccm, statut_juridique } = req.body;

    // Recherche de l'entreprise
    const enterprise = await Enterprise.findByPk(enterpriseId);

    if (!enterprise) {
      return res.status(404).json({ message: 'Entreprise non trouvée.' });
    }

    // Mise à jour de l'entreprise
    await enterprise.update({
      name,
      address,
      phone,
      ifu,
      rccm,
      statut_juridique,
    });

    return res.status(200).json({ message: 'Entreprise mise à jour avec succès.', enterprise });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l’entreprise:', error);
    return res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
};

module.exports = {
  createEnterprise,
  getEnterpriseById,
  updateEnterprise,
};
