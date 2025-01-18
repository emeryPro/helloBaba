const  User  = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Token = require('../models/Token')
const Role = require('../models/Role')
const loginUser = async (req, res) => {
  try {
    const { numberPhone, password } = req.body;

    // Vérification de l'existence de l'utilisateur par email
    const user = await User.findOne({ where: {phonenumber: numberPhone } });

    if (!user) {
      return res.status(404).json({ message: 'Informations non valides.' });
    }

    // Vérification du mot de passe
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Mot de passe incorrect.' });
    }

   

    const role = await Role.findOne({ where: { id: user.role_id } });

    if (!role) {
      return res.status(500).json({ message: 'Rôle introuvable.' });
    }

   /*  const token = jwt.sign(
      { userId: user.id, role: user.role_id }, // Payload
      process.env.JWT_SECRET, // Clé secrète
      { expiresIn: '1h' } // Durée du token
    );


   
     const expirationDate = new Date();
     expirationDate.setHours(expirationDate.getHours() + 1); */

     // Générer un token JWT
const token = jwt.sign(
  { userId: user.id, role: user.role_id }, // Payload
  process.env.JWT_SECRET, // Clé secrète
  { expiresIn: '30m' } // Durée du token (3 minutes)
);

// Calculer la date d'expiration
const expirationDate = new Date();
expirationDate.setMinutes(expirationDate.getMinutes() + 30); // Ajouter 3 minutes

 
     // Enregistrer le token dans la table `Tokens`
     await Token.create({
       user_id: user.id,
       token,
       expiration_date: expirationDate,
     });



    return res.status(200).json({
      message: 'Connexion réussie.',
      token,
      user: {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.mail,
        role: role.name,
      },
    });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    return res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
};

module.exports = { loginUser };
