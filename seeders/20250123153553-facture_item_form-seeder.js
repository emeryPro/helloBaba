'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('invoice_item_forms', [
      // group_activity_id = 2
      {
        structure: JSON.stringify({
          fields: [
            { name: "nom", label: "Nom", type: "text", placeholder: "Entrez le nom" },
            { name: "prenom", label: "Prénom", type: "text", placeholder: "Entrez le prénom" },
            { name: "adresse", label: "Adresse", type: "text", placeholder: "Entrez l'adresse" },
            { name: "numberphone", label: "Numéro de téléphone", type: "tel", placeholder: "Entrez le numéro" },
            { name: "designation", label: "Désignation", type: "text", placeholder: "Entrez la désignation" },
            { name: "pu", label: "Prix unitaire", type: "number", placeholder: "Entrez le prix unitaire" },
            { name: "quantite", label: "Quantité", type: "number", placeholder: "Entrez la quantité" },
          ],
        }),
        groupe_activity_id: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // group_activity_id = 1
      {
        structure: JSON.stringify({
          fields: [
            { name: "nom_proprietaire", label: "Nom du propriétaire", type: "text", placeholder: "Entrez le nom du propriétaire" },
            { name: "prenom_proprietaire", label: "Prénom du propriétaire", type: "text", placeholder: "Entrez le prénom du propriétaire" },
            { name: "nom_locataire", label: "Nom du locataire", type: "text", placeholder: "Entrez le nom du locataire" },
            { name: "prenom_locataire", label: "Prénom du locataire", type: "text", placeholder: "Entrez le prénom du locataire" },
            { name: "description", label: "Description", type: "text", placeholder: "Entrez une description" },
            { name: "adresse_maison", label: "Adresse de la maison", type: "text", placeholder: "Entrez l'adresse de la maison" },
            { name: "numero_locataire", label: "Numéro du locataire", type: "tel", placeholder: "Entrez le numéro du locataire" },
            { name: "montant", label: "Montant", type: "number", placeholder: "Entrez le montant" },
          ],
        }),
        groupe_activity_id: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // group_activity_id = 5
      {
        structure: JSON.stringify({
          fields: [
            { name: "nom_client", label: "Nom du client", type: "text", placeholder: "Entrez le nom du client" },
            { name: "prenom_client", label: "Prénom du client", type: "text", placeholder: "Entrez le prénom du client" },
            { name: "montant", label: "Montant", type: "number", placeholder: "Entrez le montant" },
            { name: "numero_carte", label: "Numéro de carte", type: "text", placeholder: "Entrez le numéro de carte" },
            { 
              name: "periodicite", 
              label: "Périodicité", 
              type: "select", 
              placeholder: "Choisissez une fréquence",
              options: [
                { value: "daily", label: "Quotidien" },
                { value: "weekly", label: "Hebdomadaire" },
                { value: "monthly", label: "Mensuel" },
              ],
            },
          ],
        }),
        groupe_activity_id: 9,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // group_activity_id = education et formation
      {
        structure: JSON.stringify({
          fields: [
            { name: "nom_client", label: "Nom du client", type: "text", placeholder: "Entrez le nom du client" },
            { name: "prenom_client", label: "Prénom du client", type: "text", placeholder: "Entrez le prénom du client" },
            { name: "libelle", label: "Libellé", type: "text", placeholder: "Entrez le libellé" },
            { name: "lieu_formation", label: "Lieu de la formation", type: "text", placeholder: "Entrez le lieu de la formation" },
            { name: "montant", label: "Montant", type: "number", placeholder: "Entrez le montant" },
          ],
        }),
        groupe_activity_id: 7, // ou un autre ID correspondant
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
