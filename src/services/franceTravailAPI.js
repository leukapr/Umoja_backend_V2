import axios from 'axios';
import { JobOffer } from '../models/jobOffer.model.js';
import { getFranceTravailToken } from './franceTravailAuth.js';

export async function fetchAndSaveJobOffers(keyword = 'développeur') {
  const token = await getFranceTravailToken();

  try {
    const response = await axios.get(
      'https://api.francetravail.io/partenaire/offresdemploi/v2/offres',
      {
        params: { motsCles: keyword, range: '0-9' },
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    const offres = response.data.resultats || [];

    // 🔁 Enregistrement direct dans ta DB via Sequelize
    for (const offre of offres) {
      await JobOffer.upsert({
        id: offre.id,
        intitule: offre.intitule,
        description: offre.description,
        lieuTravail: offre.lieuTravail?.libelle || null,
        entreprise: offre.entreprise?.nom || null,
        dateCreation: offre.dateCreation,
        url: offre.origineOffre?.urlOrigine || null,
      });
    }

    console.log(`💾 ${offres.length} offres enregistrées en base.`);
    return offres;
  } catch (error) {
    console.error(
      '❌ Erreur API France Travail :',
      error.response?.data || error.message,
    );
    throw new Error('Impossible de récupérer les offres France Travail.');
  }
}
