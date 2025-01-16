require('dotenv').config(); // Assurez-vous de charger les variables d'environnement

module.exports = {
  development: {
    username: process.env.DB_USERNAME || 'root', // Nom d'utilisateur par défaut
    password: process.env.DB_PASSWORD || '', // Mot de passe par défaut
    database: process.env.DB_NAME || 'backunknow', // Nom de la base de données pour le développement
    host: process.env.DB_HOST || '127.0.0.1', // Hôte de la base de données (par défaut localhost)
    dialect: 'mysql', // Type de base de données, ici MySQL
    logging: console.log, // Option pour activer ou désactiver les logs
  },
  test: {
    username: process.env.DB_USERNAME || 'root', // Utilisateur pour l'environnement de test
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'test_database', // Nom de la base de données pour les tests
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'mysql', // MySQL pour les tests
    logging: false, // Désactiver les logs pendant les tests
  },
  production: {
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'prod_database',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'mysql',
    logging: false, // Désactiver les logs en production
    dialectOptions: {
      ssl: {
        require: true, // Activer SSL pour la production
        rejectUnauthorized: false,
      },
    },
  },
};
