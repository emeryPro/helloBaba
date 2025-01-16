const User = require('../models/User'); // Import du modèle User
const Role = require('../models/Role'); // Import du modèle Role
const bcrypt = require('bcrypt'); // Pour hacher les mots de passe
const ActivityUser = require('../models/ActivityUsers')
// Créer un utilisateur



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

module.exports = {
  createUser,
  getAllUsers,
  createSecondUser,
};
