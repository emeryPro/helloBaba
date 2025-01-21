const Receipt = require('../models/Receipt')
const Invoice = require('../models/Invoice')
const Tontine = require('../models/Tontine')
const Participant =require('../models/Participant')
const Role = require('../models/Role')





const createReceipt = async (req, res) => {
    try {
      // Récupérer l'invoice_id et le montant payé depuis la requête
      const { invoice_id, amount_paid } = req.body;
  
      // Récupérer le user_id depuis le middleware
      const user_id = req.user.userId; // Assurez-vous que le middleware ajoute `req.user.id`

      if (!user_id) {
        return res.status(403).json({ message: "Id de l'utilisateur connecté non fourni." });
      }


      const userRoleId = req.user.role;
  if (!userRoleId) {
    return res.status(403).json({ message: "Rôle de l'utilisateur connecté non fourni." });
  }
  
  const directorRole = await Role.findOne({ where: { name: 'director' } });
  const cashierRole = await Role.findOne({ where: { name: 'Cashier' } });
  
  if (
     (!directorRole || parseInt(userRoleId) !== directorRole.id) && 
    (!cashierRole || parseInt(userRoleId) !== cashierRole.id)
  ) {
    return res
      .status(403)
      .json({ message: "Seuls les directeurs ou caissiers peuvent creer les factures" });
  }
  
      // Vérifier si l'ID de facture est valide
      const invoice = await Invoice.findByPk(invoice_id);
  
      if (!invoice) {
        return res.status(404).json({ message: 'Facture introuvable.' });
      }

       // Vérifier si le montant payé correspond au montant dû
    if (parseFloat(amount_paid) !== parseFloat(invoice.amount_due)) {
      return res.status(400).json({
        message: `Le montant payé (${amount_paid}) ne correspond pas au montant dû (${invoice.amount_due}) pour cette facture.`,
      });
    }
  
      // Récupérer les détails de la tontine et du participant via la facture
      const tontine = await Tontine.findByPk(invoice.tontine_id);
      const participant = await Participant.findByPk(invoice.participant_id);
  
      if (!tontine || !participant) {
        return res.status(404).json({
          message: "Tontine ou participant associé à cette facture introuvable.",
        });
      }
  
      // Générer une référence de paiement unique
      const payment_reference = `PAY-${Date.now()}-${invoice_id}`;
  
      // Créer le reçu (Receipt)
      const receipt = await Receipt.create({
        payment_reference,
        tontine_id: tontine.id,
        invoice_id: invoice.id,
        participant_id: participant.id,
        amount_paid,
        user_id: user_id,
        payment_status: 'paid', // Par défaut 'paid'
      });


      await Invoice.update(
        { status: 'paid' }, // Champ à mettre à jour
        { where: { id: invoice_id } } // Condition : l'ID de la facture
      );
  
      return res.status(201).json({
        message: 'Reçu créé avec succès et facture mise à jour.',
        receipt,
      });
    } catch (error) {
      console.error('Erreur lors de la création du reçu :', error);
      return res.status(500).json({
        message: 'Une erreur est survenue lors de la création du reçu.',
        error: error.message,
      });
    }
  };
  
  module.exports = { createReceipt };