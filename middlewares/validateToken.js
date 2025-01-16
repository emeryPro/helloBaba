// middleware/validateToken.js
const jwt = require('jsonwebtoken');
const  Token  = require('../models/Token'); // Si vous voulez vérifier le token dans la base de données

const validateToken = async (req, res, next) => {
  try {
    // Récupérer le token des en-têtes
    const token = req.header('Authorization')?.replace('Bearer ', '');

    // Vérifier si le token existe
    if (!token) {
      return res.status(401).json({ message: 'Accès non autorisé. Aucun token fourni.' });
    }

    // Vérifier si le token existe dans la base de données et n'est pas expiré
    const tokenRecord = await Token.findOne({ where: { token: token } });

    if (!tokenRecord || new Date(tokenRecord.expiration_date) < new Date()) {
      return res.status(401).json({ message: 'Token expiré ou invalide.' });
    }

    // Vérifier la validité du token avec la clé secrète
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Ajouter l'utilisateur décodé à la requête pour qu'il soit disponible dans les autres middlewares/contrôleurs
    req.user = decoded;

    // Passer au middleware ou au contrôleur suivant
    next();
  } catch (error) {
    console.error('Erreur lors de la validation du token:', error);
    return res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
};

module.exports = { validateToken };
