const User = require('../models/User'); // Import du modèle User
const Role = require('../models/Role'); // Import du modèle Role
const bcrypt = require('bcrypt'); // Pour hacher les mots de passe
const ActivityUser = require('../models/ActivityUsers')
const { Op } = require('sequelize');
// Créer un utilisateur

User.belongsTo(Role, { foreignKey: 'role_id', as: 'role2' });

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
    const userRoleId = req.user.role;
    if (!userRoleId) {
      return res.status(403).json({ message: "Rôle de l'utilisateur connecté non fourni." });
    }

    const directorRole = await Role.findOne({ where: { name: 'director' } });
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






const getUsersByDirector = async (req, res) => {
  try {
    const userRoleId = req.user.role;  // ID du rôle de l'utilisateur connecté

    // Vérification du rôle de l'utilisateur connecté
    if (!userRoleId) {
      return res.status(403).json({ message: "Rôle de l'utilisateur connecté non fourni." });
    }

    // Vérifier si l'utilisateur est bien un directeur
    const directorRole = await Role.findOne({ where: { name: 'director' } });
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

 /*    // Maintenant, récupérer tous les utilisateurs associés à ces activities
    const usersInActivities = await ActivityUser.findAll({
      where: { activity_id: activityIds },  // Trouver tous les users dans ces activités
      attributes: ['user_id'],
    });
 */

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


module.exports = {
  createUser,
  getAllUsers,
  createSecondUser,
  getUsersByDirector,
  linkUserToActivity,
};
