const User = require('../models/User'); // Import du modèle User
const Role = require('../models/Role'); // Import du modèle Role
const bcrypt = require('bcrypt'); // Pour hacher les mots de passe
const ActivityUser = require('../models/ActivityUsers')
const PermissionToUser = require('../models/PermissionUser')
const Permission = require('../models/Permission')
const DgUser = require('../models/DgUser')
const { Op } = require('sequelize');
// Créer un utilisateur

User.belongsTo(Role, { foreignKey: 'role_id', as: 'role2' });



PermissionToUser.belongsTo(Permission, { foreignKey: 'role_id', as: 'Permissions' });

// Créer un utilisateur
const createUser = async (req, res) => {
  try {
    const { lastName, firstName, numberPhone, roleName, email, password } = req.body;

    // Vérification des données d'entrée
    if (!lastName || !firstName || !numberPhone || !roleName || !email || !password) {
      return res.status(400).json({ message: 'Tous les champs sont obligatoires.' });
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ where: { mail:email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Un utilisateur avec cet email existe déjà.' });
    }
    const existingPhoneUser = await User.findOne({ where: { phonenumber:numberPhone } });
    if (existingPhoneUser) {
      return res.status(409).json({ message: 'Un utilisateur avec ce numéro de téléphone existe déjà.' });
    }
    // Rechercher l'ID du rôle
    const role = await Role.findOne({ where: { name: roleName } });
    if (!role) {
      return res.status(404).json({ message: `Le rôle "${roleName}" n'existe pas.` });
    }

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création de l'utilisateur
    const newUser = await User.create({
     lastname: lastName,
     firstname: firstName,
     phonenumber: numberPhone,
      role_id: role.id, // Utiliser l'ID du rôle
      mail: email,
      password: hashedPassword,
    });


     // Si l'utilisateur est un directeur, lui attribuer toutes les permissions
     if (roleName.toLowerCase() === 'directeur' || roleName.toLowerCase() === 'directeur') {
      // Récupérer toutes les permissions existantes
      const allPermissions = await Permission.findAll();
      
      // Ajouter chaque permission à la table permission_to_users
      for (const permission of allPermissions) {
        await PermissionToUser.create({
          user_id: newUser.id,
          permission_id: permission.id,
        });
      }
    }

    return res.status(201).json({ message: 'Utilisateur créé avec succès.', user: newUser });
  } catch (error) {
    console.error('Erreur lors de la création de l’utilisateur:', error);
    return res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
};


const createSecondUser = async (req, res) => {
  try {
    const { lastName, firstName, numberPhone, roleName, email, password, activityId } = req.body;

    // Vérification des données d'entrée
    if (!lastName || !firstName || !numberPhone || !roleName || !email || !password || !activityId) {
      return res.status(400).json({ message: 'Tous les champs sont obligatoires.' });
    }

    // Vérification du rôle de l'utilisateur connecté
    const dgId = req.user.userId
    const userRoleId = req.user.role;
    if (!userRoleId) {
      return res.status(403).json({ message: "Rôle de l'utilisateur connecté non fourni." });
    }

    const directorRole = await Role.findOne({ where: { name: 'directeur' } });
    if (!directorRole || parseInt(userRoleId) !== directorRole.id) {
      return res.status(403).json({ message: "Seuls les directeurs peuvent créer de nouveaux utilisateurs." });
    }

    // Vérifier si l'utilisateur existe déjà (email ou téléphone)
    const existingUser = await User.findOne({ where: { mail: email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Un utilisateur avec cet email existe déjà.' });
    }

    const existingPhoneUser = await User.findOne({ where: { phonenumber: numberPhone } });
    if (existingPhoneUser) {
      return res.status(409).json({ message: 'Un utilisateur avec ce numéro de téléphone existe déjà.' });
    }

    // Rechercher l'ID du rôle
    const role = await Role.findOne({ where: { name: roleName } });
    if (!role) {
      return res.status(404).json({ message: `Le rôle "${roleName}" n'existe pas.` });
    }

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création de l'utilisateur
    const newUser = await User.create({
      lastname: lastName,
      firstname: firstName,
      phonenumber: numberPhone,
      role_id: role.id, // Utiliser l'ID du rôle
      mail: email,
      password: hashedPassword,
    });

    // Lier l'utilisateur à l'activité
    await ActivityUser.create({
      activity_id: activityId,
      user_id: newUser.id,
    });

    if (dgId) {
      await DgUser.create({
        dg_id: dgId, // ID du DG
        user_id: newUser.id, // ID de l'utilisateur nouvellement créé
      });
    }
     // Déterminer les permissions en fonction du rôle
     let permissionsToAssign = [];
     if (roleName.toLowerCase() === 'secretaire' || roleName.toLowerCase() === 'secretaire') {
       permissionsToAssign = [1, 2, 4, 6];
     } else if (roleName.toLowerCase() === 'caissiere' || roleName.toLowerCase() === 'caissier') {
       permissionsToAssign = [3, 6, 7];
     } else if (roleName.toLowerCase() === 'chef agence' || roleName.toLowerCase() === 'chef agence') {
       permissionsToAssign = [5, 7];
     }
 // Ajouter les permissions à l'utilisateur
 for (const permissionId of permissionsToAssign) {
  await PermissionToUser.create({
    user_id: newUser.id,
    permission_id: permissionId,
  });
} 

    return res.status(201).json({ message: 'Utilisateur créé avec succès.', user: newUser });
  } catch (error) {
    console.error('Erreur lors de la création de l’utilisateur:', error);
    return res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
};




/* const createUser = async (req, res) => {
  try {
    const { lastname, firstname, phonenumber, role, mail, password } = req.body;

    // Vérification des données d'entrée
    if (!lastname || !firstname || !phonenumber || !role || !mail || !password) {
      return res.status(400).json({ message: 'Tous les champs sont obligatoires.' });
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ where: { mail } });
    if (existingUser) {
      return res.status(409).json({ message: 'Un utilisateur avec cet email existe déjà.' });
    }

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création de l'utilisateur
    const newUser = await User.create({ lastname,firstname, phonenumber, role, mail, password: hashedPassword });

    return res.status(201).json({ message: 'Utilisateur créé avec succès.', user: newUser });
  } catch (error) {
    console.error('Erreur lors de la création de l’utilisateur:', error);
    return res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
}; */

// Récupérer tous les utilisateurs
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }, // Exclure le mot de passe des résultats
    });

    return res.status(200).json(users);
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    return res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
};






/* const getUsersByDirector = async (req, res) => {
  try {
    const userRoleId = req.user.role;  // ID du rôle de l'utilisateur connecté

    // Vérification du rôle de l'utilisateur connecté
    if (!userRoleId) {
      return res.status(403).json({ message: "Rôle de l'utilisateur connecté non fourni." });
    }

    // Vérifier si l'utilisateur est bien un directeur
    const directorRole = await Role.findOne({ where: { name: 'directeur' } });
    if (!directorRole || parseInt(userRoleId) !== directorRole.id) {
      return res.status(403).json({ message: "Seuls les directeurs peuvent exécuter cette requête." });
    }

    // ID du directeur connecté (par exemple, depuis le token ou session)
    const directorId = req.user.userId;

    // Récupérer les activity_id associés au directeur via la table activityuser
    const userActivities = await ActivityUser.findAll({
      where: { user_id: directorId },  // Cherche les activités du directeur
      attributes: ['activity_id'],  // Nous voulons juste les ID des activités
    });

    if (userActivities.length === 0) {
      return res.status(404).json({ message: 'Aucune activité trouvée pour ce directeur.' });
    }

    // Extraire les IDs des activités
    const activityIds = userActivities.map(activityUser => activityUser.activity_id);



     // Récupérer tous les utilisateurs associés à ces activités, mais exclure le directeur
     const usersInActivities = await ActivityUser.findAll({
      where: {
        activity_id: activityIds,  // Trouver tous les users dans ces activités
        user_id: { [Op.ne]: directorId },  // Exclure le directeur
      },
      attributes: ['user_id'],
    });
    // Extraire les IDs des utilisateurs associés
    const userIds = usersInActivities.map(activityUser => activityUser.user_id);

    if (userIds.length === 0) {
      return res.status(404).json({ message: 'Aucun utilisateur trouvé pour ces activités.' });
    }

    // Récupérer les détails des utilisateurs
    const users = await User.findAll({
      where: { id: userIds },  // Récupérer les utilisateurs associés aux activity_ids
      attributes: ['id', 'firstname', 'lastname', 'mail'],  // Sélectionner les attributs nécessaires
      include: [
        {
          model: Role,
          as: 'role2',  // Récupérer le rôle associé à l'utilisateur
          attributes: ['name'],  // On ne récupère que le nom du rôle
        }
      ],
    });

    // Retourner les utilisateurs associés aux activités du directeur
    return res.status(200).json({
      message: 'Utilisateurs récupérés avec succès.',
      users,
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    return res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
}; */



const getUsersByDirector = async (req, res) => {
  try {
    const userRoleId = req.user.role;  // ID du rôle de l'utilisateur connecté

    // Vérification du rôle de l'utilisateur connecté
    if (!userRoleId) {
      return res.status(403).json({ message: "Rôle de l'utilisateur connecté non fourni." });
    }

    // Vérifier si l'utilisateur est bien un directeur
    const directorRole = await Role.findOne({ where: { name: 'directeur' } });
    if (!directorRole || parseInt(userRoleId) !== directorRole.id) {
      return res.status(403).json({ message: "Seuls les directeurs peuvent exécuter cette requête." });
    }

    // ID du directeur connecté
    const directorId = req.user.userId;

    // 🔹 Étape 1 : Récupérer les utilisateurs liés au directeur via DgUser
    const dgUsers = await DgUser.findAll({
      where: { dg_id: directorId },  // Cherche les utilisateurs liés au directeur
      attributes: ['user_id'],  // On ne récupère que les IDs des utilisateurs
    });

    if (dgUsers.length === 0) {
      return res.status(404).json({ message: 'Aucun utilisateur trouvé pour ce directeur.' });
    }

    // Extraire les IDs des utilisateurs trouvés
    const userIds = dgUsers.map(dgUser => dgUser.user_id);

    // 🔹 Étape 2 : Récupérer les activités associées à chaque utilisateur
    const userActivities = await ActivityUser.findAll({
      where: { user_id: userIds }, // Trouver les activités des utilisateurs liés au DG
      attributes: ['user_id', 'activity_id'], // On récupère l'ID de l'utilisateur et de l'activité
    });

    // Organiser les activités par utilisateur
    const userActivitiesMap = {};
    userActivities.forEach(activity => {
      if (!userActivitiesMap[activity.user_id]) {
        userActivitiesMap[activity.user_id] = [];
      }
      userActivitiesMap[activity.user_id].push(activity.activity_id);
    });

    // 🔹 Étape 3 : Récupérer les informations des utilisateurs
    const users = await User.findAll({
      where: { id: userIds },
      attributes: ['id', 'firstname', 'lastname', 'mail'],
      include: [
        {
          model: Role,
          as: 'role2', // Récupérer le rôle
          attributes: ['name'],
        }
      ],
    });

    // Ajouter les activités associées à chaque utilisateur
    const usersWithActivities = users.map(user => ({
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      mail: user.mail,
      role: user.role2 ? user.role2.name : null, // Si l'utilisateur a un rôle, on l'ajoute
      activities: userActivitiesMap[user.id] || [], // Liste des activités associées
    }));

    // Retourner la réponse
    return res.status(200).json({
      message: 'Utilisateurs récupérés avec succès.',
      users: usersWithActivities,
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    return res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
};




const linkUserToActivity = async (req, res) => {
  try {
    const { userId, activityId } = req.body; // userId et activityId sont envoyés dans le body de la requête

    // Vérification des données d'entrée
    if (!userId || !activityId) {
      return res.status(400).json({ message: 'L\'ID de l\'utilisateur et de l\'activité sont obligatoires.' });
    }

    // Vérification de l'existence de l'utilisateur
    const user = await User.findByPk(userId);  // Utilisation de la méthode findByPk si tu utilises l'ID utilisateur
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    // Vérifier si l'utilisateur est déjà lié à cette activité
    const existingLink = await ActivityUser.findOne({
      where: { user_id: userId, activity_id: activityId },
    });
    if (existingLink) {
      return res.status(409).json({ message: 'Cet utilisateur est déjà lié à cette activité.' });
    }

    // Créer la liaison entre l'utilisateur et l'activité
    await ActivityUser.create({
      activity_id: activityId,
      user_id: userId,
    });

    return res.status(201).json({ message: 'Utilisateur lié à l\'activité avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la liaison de l\'utilisateur à l\'activité:', error);
    return res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
};

const unlinkUserFromActivity = async (req, res) => {
  try {
    // 1. Vérifier si l'utilisateur connecté est un directeur
    const userRoleId = req.user.role;
    if (!userRoleId) {
      return res.status(403).json({ message: "Rôle de l'utilisateur connecté non fourni." });
    }

    const directorRole = await Role.findOne({ where: { name: 'directeur' } });
    if (!directorRole || parseInt(userRoleId) !== directorRole.id) {
      return res.status(403).json({ message: "Seuls les directeurs peuvent exécuter cette action." });
    }

    // 2. Récupérer les données du client (user_id et activity_id)
    const { user_id, activity_id } = req.body;
    if (!user_id || !activity_id) {
      return res.status(400).json({ message: "Les champs 'user_id' et 'activity_id' sont obligatoires." });
    }

    // 3. Vérifier si l'utilisateur est bien lié à l'activité dans ActivityUser
    const activityUser = await ActivityUser.findOne({
      where: {
        user_id,
        activity_id
      }
    });

    if (!activityUser) {
      return res.status(404).json({ message: "Cette liaison utilisateur-activité n'existe pas." });
    }

    // 4. Supprimer la liaison entre l'utilisateur et l'activité
    await ActivityUser.destroy({
      where: {
        user_id,
        activity_id
      }
    });

    return res.status(200).json({ message: "Liaison supprimée avec succès." });
  } catch (error) {
    console.error("Erreur lors de la suppression de la liaison:", error);
    return res.status(500).json({ message: "Erreur interne du serveur." });
  }
};





const updateUserPermission = async (req, res) => {
  try {
    const { userId, permissionId, hasPermission } = req.body;


   

    const roleId = req.user.role;
    
    // Récupérer le rôle de l'utilisateur en fonction de son ID
    const role = await Role.findByPk(roleId);

    if (!role || role.name !== 'Directeur') {
      return res.status(403).json({ message: 'Accès interdit. Seul un Directeur peut gerer les permissions.' });
    }

    // Vérification des données d'entrée
    if (userId === undefined || permissionId === undefined || hasPermission === undefined) {
      return res.status(400).json({ message: 'userId, permissionId et hasPermission sont obligatoires.' });
    }

    // Vérifier si l'utilisateur existe
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    // Vérifier si la permission existe
    const permission = await Permission.findByPk(permissionId);
    if (!permission) {
      return res.status(404).json({ message: 'Permission non trouvée.' });
    }

    if (hasPermission) {
      // Si on veut ajouter la permission
      const existingRelation = await PermissionToUser.findOne({
        where: { user_id: userId, permission_id: permissionId },
      });

      if (existingRelation) {
        return res.status(400).json({ message: 'Cette permission est déjà attribuée à cet utilisateur.' });
      }

      // Créer la relation dans la table permission_to_user
      await PermissionToUser.create({
        user_id: userId,
        permission_id: permissionId,
      });

      return res.status(200).json({ message: 'Permission ajoutée à l\'utilisateur.' });
    } else {
      // Si on veut supprimer la permission
      const existingRelation = await PermissionToUser.findOne({
        where: { user_id: userId, permission_id: permissionId },
      });

      if (!existingRelation) {
        return res.status(400).json({ message: 'Cette permission n\'est pas attribuée à cet utilisateur.' });
      }

      // Supprimer la relation dans la table permission_to_user
      await PermissionToUser.destroy({
        where: { user_id: userId, permission_id: permissionId },
      });

      return res.status(200).json({ message: 'Permission supprimée de l\'utilisateur.' });
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la permission de l\'utilisateur:', error);
    return res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
};


const getUserPermissions = async (req, res) => {
  try {
    const { userId } = req.params; // Récupérer l'userId depuis les paramètres de la requête

    // Vérifier si l'utilisateur existe
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    // Récupérer les permissions associées à cet utilisateur
    const permissions = await PermissionToUser.findAll({
      where: { user_id: userId },
      include: {
        model: Permission, // Inclure les détails de la permission
        as: 'permissions',
        attributes: ['id', 'description'], // Les attributs de la table Permission à récupérer
      },
    });

    // Si l'utilisateur n'a aucune permission
    if (permissions.length === 0) {
      return res.status(404).json({ message: 'Aucune permission trouvée pour cet utilisateur.' });
    }

    // Extraire les informations des permissions et les envoyer dans la réponse
    const permissionDetails = permissions.map(permission => permission.Permission);

    return res.status(200).json({ permissions: permissionDetails });
  } catch (error) {
    console.error('Erreur lors de la récupération des permissions de l\'utilisateur:', error);
    return res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
};





module.exports = {
  createUser,
  getAllUsers,
  createSecondUser,
  getUsersByDirector,
  linkUserToActivity,
  unlinkUserFromActivity,
  updateUserPermission,
  getUserPermissions
};
