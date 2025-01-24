const generateInvoiceNumber = async () => {
    // Logique pour générer un numéro de facture unique
    const timestamp = Date.now();
    const randomSuffix = Math.floor(Math.random() * 1000);
    const invoiceNumber = `INV-${timestamp}-${randomSuffix}`;
  
    return invoiceNumber;
  };
  
 /*  module.exports = { generateInvoiceNumber }; */

 module.exports = generateInvoiceNumber;
  