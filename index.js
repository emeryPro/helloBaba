// app.js
const express = require('express');
const { Sequelize } = require('sequelize');
const userRoutes = require('./routes/userRoutes');

const authRoutes = require('./routes/authRoutes');
const activityRoute = require('./routes/activityRoute')
const roleRoute = require('./routes/roleRoute')
const participantRoute = require('./routes/participantRoute')
const invoiceRoute = require('./routes/invoiceRoute')
const receiptRoute = require('./routes/receiptRoute')
const tontineRoute = require('./routes/tontineRoute')
const customerRoute = require('./routes/customerRoute')
const cors = require('cors');
require('dotenv').config(); // Charger les variables d'environnement
require('./config/cronJobs');




// Créez l'instance Sequelize
const sequelize = new Sequelize({
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  dialect: 'mysql',
});

const app = express();



app.use(cors(
  {
      origin:["http://192.168.100.29:5173"],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
      optionsSuccessStatus: 204,

  }
));   


// Middleware pour analyser le JSON
app.use(express.json());

// Utilisez les routes
app.use('/api', userRoutes);

app.use('/api', authRoutes);
app.use('/api',activityRoute);
app.use('/api',roleRoute);
app.use('/api',participantRoute);
app.use('/api',invoiceRoute);
app.use('/api',receiptRoute)
app.use('/api',tontineRoute)
app.use('/api',customerRoute)

// Tester la connexion à la base de données
sequelize.authenticate()
  .then(() => {
    console.log('Base de données connectée');
  })
  .catch((err) => {
    console.error('Impossible de se connecter à la base de données:', err);
  });

// Synchroniser les modèles avec la base de données
sequelize.sync()
  .then(() => {
    console.log('Les modèles ont été synchronisés avec la base de données');
  })
  .catch((err) => {
    console.error('Erreur lors de la synchronisation des modèles:', err);
});

// Démarrez le serveur
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
