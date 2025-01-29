// middleware/validatePermissions.js
const jwt = require('jsonwebtoken');
const  Token  = require('../models/Token');
const Permission = require('../models/Permission')
const PermissionToUser = require('../models/PermissionUser')



/* PermissionToUser.belongsTo(Permission, { foreignKey: 'role_id', as: 'Permissions' }); */
/* const validatePermissions = (requiredPermissions) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.userId; // L'ID utilisateur extrait du token validé dans `validateToken`

      // Récupérer les permissions associées à l'utilisateur
      const userPermissions = await PermissionToUser.findAll({
        where: { user_id: userId },
        include: {
          model: Permission,
          as: 'Permissions',
          attributes: ['id', 'description'], // Vous pouvez récupérer les informations que vous voulez de la table Permission
        }
      });

      // Extraire les ID des permissions que l'utilisateur possède
      const userPermissionIds = userPermissions.map((perm) => perm.permission.id);

      // Vérifier si l'utilisateur a toutes les permissions nécessaires
      const hasPermissions = requiredPermissions.every(permission => userPermissionIds.includes(permission));

      if (!hasPermissions) {
        return res.status(403).json({ message: "Accès interdit. Permissions insuffisantes." });
      }

      // Si l'utilisateur a les permissions nécessaires, passer au middleware ou contrôleur suivant
      next();
    } catch (error) {
      console.error('Erreur lors de la validation des permissions:', error);
      return res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
  };
}; */



const validatePermissions = (requiredPermissions) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.userId; // L'ID utilisateur extrait du token validé dans `validateToken`

      // Récupérer les permissions associées à l'utilisateur connecté dans PermissionToUser
      const userPermissions = await PermissionToUser.findAll({
        where: { user_id: userId }, // Filtrer par l'utilisateur connecté
        attributes: ['permission_id'], // On récupère uniquement les permission_id
      });

      // Extraire uniquement les IDs des permissions
      const userPermissionIds = userPermissions.map((perm) => perm.permission_id);

      // Vérifier si l'utilisateur a toutes les permissions nécessaires
      const hasPermissions = requiredPermissions.every(permission =>
        userPermissionIds.includes(permission)
      );

      // Si l'utilisateur ne possède pas toutes les permissions nécessaires
      if (!hasPermissions) {
        return res.status(403).json({ message: 'Accès interdit. Permissions insuffisantes.' });
      }

      // Si l'utilisateur possède les permissions nécessaires, on continue
      next();
    } catch (error) {
      console.error('Erreur lors de la validation des permissions :', error);
      return res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
  };
};

module.exports = { validatePermissions };
