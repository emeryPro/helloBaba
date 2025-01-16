const Role = require('../models/Role'); // Assurez-vous d'importer le modèle Role
const Sequelize = require('sequelize');
const { Op } = Sequelize; 
const getRoles = async (req, res) => {
  try {
    // Récupérer tous les rôles sauf "admin" et "director"
    const roles = await Role.findAll({
      where: {
        name: {
          [Op.notIn]: ['admin', 'director'], // Exclure les rôles "admin" et "director"
        },
      },
    });

    if (roles.length === 0) {
      return res.status(404).json({ message: 'Aucun rôle trouvé.' });
    }

    return res.status(200).json({
      message: 'Rôles récupérés avec succès.',
      roles,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des rôles:', error);
    return res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
};

module.exports = { getRoles };
