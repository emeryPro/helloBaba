const cron = require('node-cron');
const  Token  = require('../models/Token');
const { Op } = require('sequelize');

// Planifier une tâche pour supprimer les tokens expirés toutes les heures
cron.schedule('0 * * * *', async () => {
  try {
    const result = await Token.destroy({
      where: {
        expiration_date: { [Op.lt]: new Date() },
      },
    });
    console.log(`${result} tokens expirés supprimés.`);
  } catch (error) {
    console.error('Erreur lors de la suppression des tokens expirés:', error);
  }
});
