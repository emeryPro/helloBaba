
const Tontine = require('../models/Tontine');
const Invoice = require('../models/Invoice')
const Participant = require('../models/Participant')
const Role = require('../models/Role')




Invoice.belongsTo(Tontine, { foreignKey: 'tontine_id', as: 'tont' });
Tontine.belongsTo(Participant, { foreignKey: 'participant_id', as: 'particip' });

const createInvoice = async (req, res) => {
  const { tontine_id, amount_paid } = req.body;
  const user_id = req.user.userId;


  const userRoleId = req.user.role;
  if (!userRoleId) {
    return res.status(403).json({ message: "Rôle de l'utilisateur connecté non fourni." });
  }
  
  const directorRole = await Role.findOne({ where: { name: 'director' } });
  const secretaryRole = await Role.findOne({ where: { name: 'secretary' } });
  
  if (
    (!directorRole || parseInt(userRoleId) !== directorRole.id) &&
    (!secretaryRole || parseInt(userRoleId) !== secretaryRole.id)
  ) {
    return res
      .status(403)
      .json({ message: "Seuls les directeurs ou secrétaires peuvent creer les factures" });
  }
  try {
    // Récupérer les informations de la tontine
    const tontine = await Tontine.findByPk(tontine_id);
    if (!tontine) {
      return res.status(404).json({ message: 'Tontine non trouvée.' });
    }



    const { amount_per_payment, payment_frequency, duration } = tontine;

    // Vérifier combien de périodes peuvent être couvertes
    const periodsCovered = Math.floor(amount_paid / amount_per_payment);
    if (periodsCovered === 0) {
      return res
        .status(400)
        .json({ message: 'Le montant payé est insuffisant pour une période complète.' });
    }

    // Trouver le nombre de paiements déjà effectués
    const invoicesPaid = await Invoice.count({
      where: { tontine_id, participant_id: tontine.participant_id, status: 'paid' },
    });

    // Vérifier si on dépasse la durée totale
    const remainingPeriods = duration - invoicesPaid;
    if (periodsCovered > remainingPeriods) {
      return res
        .status(400)
        .json({ message: `Le montant payé dépasse la durée totale restante (${remainingPeriods} périodes).` });
    }

    // Créer des factures pour chaque période couverte
    const invoices = [];
    for (let i = 0; i < periodsCovered; i++) {
      const dueDate = calculateDueDate(payment_frequency, invoicesPaid + i + 1); // Calculer la date d'échéance
      invoices.push({
        tontine_id,
        user_id,
        participant_id: tontine.participant_id,
        amount_due: amount_per_payment,
        due_date: dueDate,
        status: 'unpaid', // Par défaut, si le paiement est immédiat
        payment_date: new Date(),
      });
    }

    // Enregistrer les factures
    await Invoice.bulkCreate(invoices);

    res.status(201).json({ message: 'Factures enregistrées avec succès.', invoices });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la création des factures.' });
  }
};

// Fonction pour calculer la date d'échéance
function calculateDueDate(payment_frequency, period) {
  const now = new Date();
  switch (payment_frequency) {
    case 'daily':
      return new Date(now.setDate(now.getDate() + period - 1));
    case 'weekly':
      return new Date(now.setDate(now.getDate() + (period - 1) * 7));
    case 'monthly':
      return new Date(now.setMonth(now.getMonth() + period - 1));
    default:
      throw new Error('Fréquence de paiement inconnue.');
  }
}




const getInvoicesByTontine = async (req, res) => {
  const { tontine_id } = req.params;

  const userRoleId = req.user.role;
if (!userRoleId) {
  return res.status(403).json({ message: "Rôle de l'utilisateur connecté non fourni." });
}

const directorRole = await Role.findOne({ where: { name: 'director' } });
const secretaryRole = await Role.findOne({ where: { name: 'secretary' } });

if (
  (!directorRole || parseInt(userRoleId) !== directorRole.id) &&
  (!secretaryRole || parseInt(userRoleId) !== secretaryRole.id)
) {
  return res
    .status(403)
    .json({ message: "Seuls les directeurs ou secrétaires peuvent voire les factures" });
}


  try {
    // Vérifier si tontine_id est fourni
    if (!tontine_id) {
      return res.status(400).json({ message: 'L\'ID de la tontine est requis.' });
    }

    // Récupérer les factures pour la tontine spécifiée
    const invoices = await Invoice.findAll({
      where: { tontine_id },
      order: [['status', 'ASC']], // Classement par statut dans l'ordre alphabétique
    });

    // Vérifier si des factures ont été trouvées
    if (invoices.length === 0) {
      return res.status(404).json({ message: 'Aucune facture trouvée pour cette tontine.' });
    }

    

    res.status(200).json({
      message: 'Factures récupérées avec succès.',
      data: invoices,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des factures.' });
  }
};




const getUnpaidInvoicesByActivity = async (req, res) => {
  try {
    const { activity_id } = req.params; // Récupérer l'ID de l'activité depuis les paramètres de la requête

    
    
    
    const userRoleId = req.user.role;
    if (!userRoleId) {
      return res.status(403).json({ message: "Rôle de l'utilisateur connecté non fourni." });
    }
    
    const directorRole = await Role.findOne({ where: { name: 'director' } });
    const secretaryRole = await Role.findOne({ where: { name: 'Cashier' } });
    
    if (
      (!directorRole || parseInt(userRoleId) !== directorRole.id) &&
      (!secretaryRole || parseInt(userRoleId) !== secretaryRole.id)
    ) {
      return res
        .status(403)
        .json({ message: "Seuls les directeurs ou caissiers peuvent voire les factures" });
    }
    
    
    
    
    // Vérifier si l'ID de l'activité est fourni
    if (!activity_id) {
      return res.status(400).json({ message: "L'ID de l'activité est requis." });
    }

    // Récupérer les tontines associées à l'activity_id donné
    const tontines = await Tontine.findAll({
      where: { activity_id },
      attributes: ['id'], // On ne récupère que les IDs des tontines
    });

    // Vérifier si des tontines sont trouvées
    if (tontines.length === 0) {
      return res.status(404).json({ message: "Aucune tontine trouvée pour cette activité." });
    }

    // Extraire les IDs des tontines
    const tontineIds = tontines.map((tontine) => tontine.id);

    // Récupérer les factures non payées associées aux tontines trouvées
    const unpaidInvoices = await Invoice.findAll({
      where: {
        tontine_id: tontineIds, // Filtrer par les IDs des tontines
        status: 'unpaid', // Factures non payées
      },
      order: [['createdAt', 'DESC']], // Trier par date (plus récent au plus ancien)

      include: [
        {
          model: Tontine, // Inclure les informations de la tontine
          as: 'tont', // Assurez-vous que l'alias correspond à votre relation
          attributes: ['id', 'card_number', 'amount_per_payment', 'payment_frequency'], // Champs spécifiques à inclure
          include: [
            {
              model: Participant, // Inclure les informations du participant
              as: 'particip', // Assurez-vous que l'alias correspond à votre relation
              attributes: ['id', 'first_name', 'last_name', 'phone'], // Champs spécifiques du participant
            },
          ],
        },
      ],




    });

    // Vérifier si des factures non payées sont trouvées
    if (unpaidInvoices.length === 0) {
      return res.status(404).json({ message: "Aucune facture non payée trouvée pour ces tontines." });
    }

    // Retourner les factures non payées
    return res.status(200).json({
      message: "Factures non payées récupérées avec succès.",
      invoices: unpaidInvoices,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur.", error: error.message });
  }
};









module.exports = { 
    createInvoice,
    getInvoicesByTontine,
    getUnpaidInvoicesByActivity,
    };