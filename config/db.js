const { Sequelize } = require('sequelize');
const config = require('./config');

// Utilisation de la configuration pour l'environnement actuel
const environment = process.env.NODE_ENV || 'development';
const dbConfig = config[environment];

// Création d'une instance de Sequelize
const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig);

sequelize.authenticate()
  .then(() => {
    console.log('La connexion à la base de données a réussi.');
  })
  .catch(err => {
    console.error('Impossible de se connecter à la base de données:', err);
  });

module.exports = sequelize;
