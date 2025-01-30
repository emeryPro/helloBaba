const { Op } = require('sequelize');
const Invoice = require('../models/Invoice')
const InvoiceItem = require('../models/InvoiceItem')
const Receipt = require('../models/Receipt')
const Customer = require('../models/Customers')

/* InvoiceItem.belongsTo(Invoice, { foreignKey: 'invoice_id', as: 'invoiceItem_0' }); */
Receipt.belongsTo(Invoice, { foreignKey: 'invoice_id', as: 'receiptInvoice' });
Invoice.belongsTo(Customer, { foreignKey: 'customers_id', as: 'invoiceCustomertwo' });

const generatePaymentReference = () => {
    const now = new Date();
    const timestamp = now.getTime(); // Obtenir l'horodatage
    const randomSuffix = Math.floor(Math.random() * 1000); // Ajouter un suffixe aléatoire
    return `PAY-${timestamp}-${randomSuffix}`;
  };

const registerPayment = async (req, res) => {
  const { invoice_id, amound_paid } = req.body;

  try {
    // Vérifier si la facture existe


    const userId = req.user.userId;



    const invoice = await Invoice.findOne({
      where: { id: invoice_id },
      include: [
        {
          model: InvoiceItem,
          as: 'invoiceItem', // Alias pour les items
          attributes: ['id', 'json'], // Récupérer uniquement le champ JSON
        },
      ],
    });

    if (!invoice) {
      return res.status(404).json({ message: 'Facture introuvable.' });
    }
/* 
    // Calculer le total attendu à partir des items
    let totalExpected = 0;

    invoice.invoiceItem.forEach((item) => {
      const { json } = item; // Champ JSON contenant les détails
      const { quantite, pu, montant } = json; // Extraire les valeurs du JSON

      if (montant) {
        // Si le montant est directement fourni
        totalExpected += parseFloat(montant);
      } else if (quantite && pu) {
        // Si quantite et pu sont disponibles, calculer le montant
        totalExpected += parseFloat(quantite) * parseFloat(pu);
      }
    });

    // Vérifier si le montant payé correspond au montant attendu
    if (amound_paid !== totalExpected) {
      return res.status(400).json({
        message: 'Le montant payé ne correspond pas au total attendu.',
        totalExpected,
        amound_paid,
      });
    }
 */


     // Générer une référence unique pour le paiement
     const reference_payement = generatePaymentReference();



    // Enregistrer le paiement
    const receipt = await Receipt.create({
      invoice_id,
      reference_payement,
      amound_paid,
      createBy: userId,
    });

    // Mettre à jour le statut de la facture
await Invoice.update(
    { statut: 'paid' }, // Nouveau statut (par exemple, 'paid' pour payé)
    { where: { id: invoice_id } } // Condition pour identifier la facture
  );
    // Retourner les informations détaillées au client
    return res.status(201).json({
      message: 'Paiement enregistré avec succès.',
      receipt,
      invoiceDetails: {
        invoice_id: invoice.id,
        items: invoice.invoiceItem.map((item) => ({
          id: item.id,
          details: item.json,
        })),
       /*  totalExpected, */
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur lors de l’enregistrement du paiement.' });
  }
};



const getPaymentDetails = async (req, res) => {
    const { paymentId } = req.params;
  
    try {
      // Trouver le paiement avec son ID
      const receipt = await Receipt.findOne({
        where: { id: paymentId },
        include: [
          {
            model: Invoice,
            as: 'receiptInvoice', // Alias défini dans Receipt.associate
            attributes: ['id','facturenumber','statut','customers_id','activity_id','createBy'], // Récupérer des champs spécifiques de la facture
          },
        ],
      });
  
      // Vérifier si le paiement existe
      if (!receipt) {
        return res.status(404).json({ message: 'Paiement introuvable.' });
      }
  
      // Trouver les items associés à la facture
      const invoiceItems = await InvoiceItem.findAll({
        where: { invoice_id: receipt.invoice_id },
        attributes: ['id', 'json'], // Récupérer uniquement l'ID et le champ JSON
      });
  
      // Construire la réponse
      const response = {
        payment: {
          id: receipt.id,
          reference_payement: receipt.reference_payement,
          amound_paid: receipt.amound_paid,
          createdBy: receipt.createBy,
          createdAt: receipt.createdAt,
        },
        invoice: {
          id: receipt.invoice_id,
          total: receipt.receiptInvoice.total, // Si le total est présent dans la facture
          items: invoiceItems.map((item) => ({
            id: item.id,
            details: item.json,
          })),
        },
      };
  
      // Retourner les informations
      return res.status(200).json({
        message: 'Détails du paiement récupérés avec succès.',
        data: response,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erreur lors de la récupération des détails du paiement.' });
    }
  };
  


  /* const getPaymentsByActivity = async (req, res) => {
    try {
      const { activity_id } = req.params;
  
      // Étape 1: Récupérer toutes les factures liées à l'activity_id
      const invoices = await Invoice.findAll({
        where: { activity_id },
        include: [
          {
            model: Customer,
            as: 'invoiceCustomer',
            attributes: ['id', 'first_name', 'last_name', 'phonenumber','address'], // Ajouter les champs que tu veux pour le client
            required: false,
        },
        ],
      });
  
      // Vérifier si des factures existent
      if (!invoices || invoices.length === 0) {
        return res.status(404).json({ message: "Aucune facture trouvée pour cette activité." });
      }
  
      // Étape 2: Pour chaque facture, récupérer ses reçus et items associés
      const payments = await Promise.all(
        invoices.map(async (invoice) => {
          const receipts = await Receipt.findAll({
            where: { invoice_id: invoice.id },
            attributes: ['id', 'reference_payement', 'amound_paid', 'createdAt'],
          });
  
          const invoiceItems = await InvoiceItem.findAll({
            where: { invoice_id: invoice.id },
            attributes: ['id', 'designation', 'json'],
          });
  
          return {
            invoice: {
              id: invoice.id,
              facturenumber: invoice.facturenumber,
              statut: invoice.statut,
              customer: invoice.invoiceCustomer,
            },
           
            invoiceItems,
            receipts,
          };
        })
      );
  
      // Retourner les résultats
      res.status(200).json(payments);
    } catch (error) {
      console.error('Erreur lors de la récupération des paiements :', error);
      res.status(500).json({ message: 'Une erreur est survenue.', error });
    }
  };
 */



  const getPaymentsByActivity = async (req, res) => {
    try {
        const { activity_id } = req.params;

        // Étape 1: Récupérer toutes les factures liées à l'activity_id avec le client
        const invoices = await Invoice.findAll({
            where: { activity_id },
            include: [
                {
                    model: Customer,
                    as: 'invoiceCustomer',
                    attributes: ['id', 'first_name', 'last_name', 'phonenumber', 'address'],
                    required: false,
                },
            ],
        });

        // Vérifier si des factures existent
        if (!invoices || invoices.length === 0) {
            return res.status(404).json({ message: "Aucune facture trouvée pour cette activité." });
        }

        // Récupérer tous les IDs de factures pour éviter plusieurs requêtes
        const invoiceIds = invoices.map(inv => inv.id);

        // Étape 2: Récupérer en une seule requête tous les items liés aux factures
        const invoiceItems = await InvoiceItem.findAll({
            where: { invoice_id: invoiceIds },
            attributes: ['id', 'invoice_id', /* 'designation', */ 'json'],
        });

        // Étape 3: Récupérer en une seule requête tous les paiements liés aux factures
        const receipts = await Receipt.findAll({
            where: { invoice_id: invoiceIds },
            attributes: ['id', 'invoice_id', 'reference_payement', 'amound_paid', 'createdAt'],
        });

    /*     // Organisation des données
        const invoicesWithDetails = invoices.map(invoice => {
            return {
                id: invoice.id,
                facturenumber: invoice.facturenumber,
                statut: invoice.statut,
                customer: invoice.invoiceCustomer,
                invoiceItems: invoiceItems.filter(item => item.invoice_id === invoice.id),
                receipts: receipts.filter(receipt => receipt.invoice_id === invoice.id),
            };
        }); */


        // Organisation des données avec receipts comme parent
        const receiptsWithDetails = receipts.map(receipt => {
          // Trouver la facture associée au reçu
          const invoice = invoices.find(inv => inv.id === receipt.invoice_id);

          return {
              id: receipt.id,
              reference_payement: receipt.reference_payement,
              amound_paid: receipt.amound_paid,
              createdAt: receipt.createdAt,
              invoice: invoice ? {
                  id: invoice.id,
                  facturenumber: invoice.facturenumber,
                  statut: invoice.statut,
                  customer: invoice.invoiceCustomer,
                  invoiceItems: invoiceItems.filter(item => item.invoice_id === invoice.id),
              } : null,
          };
      });

        // Retourner les données bien structurées
        return res.status(200).json({
            message: "Paiements récupérés avec succès.",
            invoices: receiptsWithDetails,
        });

    } catch (error) {
        console.error('Erreur lors de la récupération des paiements:', error);
        return res.status(500).json({ message: "Erreur interne du serveur." });
    }
};






  const getPaymentsByDateRange = async (req, res) => {
    try {
      const { start_date, end_date } = req.query; // Récupérer les dates passées en query params
      const { activity_id } = req.params;
  
      // Si les dates ne sont pas fournies, on prend la date du jour par défaut
      const today = new Date();
      const startDate = start_date ? new Date(start_date) : new Date(today.setHours(0, 0, 0, 0)); // Début de la journée
      const endDate = end_date ? new Date(end_date) : new Date(today.setHours(23, 59, 59, 999)); // Fin de la journée
  
      // Étape 1 : Récupérer toutes les factures liées à l'activity_id
      const invoices = await Invoice.findAll({
        where: { activity_id },
        include: [
          {
            model: Customer,
            as: 'invoiceCustomer',
            attributes: ['id', 'first_name', 'last_name', 'phonenumber', 'address'], // Ajouter les champs désirés
            required: false,
          },
        ],
      });
  
      // Vérifier si des factures existent
      if (!invoices || invoices.length === 0) {
        return res.status(404).json({ message: 'Aucune facture trouvée pour cette activité.' });
      }
  
      // Étape 2 : Filtrer les paiements par intervalle de dates
      const payments = await Promise.all(
        invoices.map(async (invoice) => {
          // Récupérer les reçus (paiements) dans l'intervalle de dates
          const receipts = await Receipt.findAll({
            where: {
              invoice_id: invoice.id,
              createdAt: {
                [Op.between]: [startDate, endDate], // Filtrer par intervalle de dates
              },
            },
            attributes: ['id', 'reference_payement', 'amound_paid', 'createdAt'],
          });
  
          // Récupérer les items de la facture
          const invoiceItems = await InvoiceItem.findAll({
            where: { invoice_id: invoice.id },
            attributes: ['id', 'designation', 'json'],
          });
  
          return {
            invoice: {
              id: invoice.id,
              facturenumber: invoice.facturenumber,
              statut: invoice.statut,
              customer: invoice.invoiceCustomer,
            },
            invoiceItems,
            receipts,
          };
        })
      );
  
      // Filtrer uniquement les factures ayant au moins un reçu dans l'intervalle
      const filteredPayments = payments.filter(payment => payment.receipts.length > 0);
  
      // Retourner les résultats
      res.status(200).json(filteredPayments);
    } catch (error) {
      console.error('Erreur lors de la récupération des paiements :', error);
      res.status(500).json({ message: 'Une erreur est survenue.', error });
    }
  };
  



module.exports = { registerPayment, getPaymentDetails, getPaymentsByActivity, getPaymentsByDateRange };
