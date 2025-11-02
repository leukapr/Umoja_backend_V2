import bcrypt from 'bcrypt';
import { JobOffer, User } from '../models/index.js';
import { TypeContrat } from '../types/index.js';

export const seedDatabase = async (): Promise<void> => {
  try {
    console.log('🌱 Insertion des données de test...');

    // Créer un utilisateur admin
    const hashedPassword = await bcrypt.hash('admin123', 10);

    await User.create({
      username: 'admin',
      email: 'admin@umoja.fr',
      password: hashedPassword,
    });

    console.log('✅ Utilisateur admin créé');

    // Créer quelques offres d'emploi
    const offers = await JobOffer.bulkCreate([
      {
        intitule: 'Développeur Full Stack TypeScript',
        description:
          'Nous recherchons un développeur Full Stack maîtrisant TypeScript, Node.js et React.',
        lieuTravail: 'Toulouse',
        entreprise: 'Airbus',
        typeContrat: TypeContrat.CDI,
        salaire: '45000 - 55000€',
      },
      {
        intitule: 'Data Scientist Python',
        description:
          'Rejoignez notre équipe Data pour analyser et modéliser des données complexes.',
        lieuTravail: 'Paris',
        entreprise: 'Capgemini',
        typeContrat: TypeContrat.CDI,
        salaire: '50000 - 65000€',
      },
      {
        intitule: 'Développeur Mobile React Native',
        description:
          "Création d'applications mobiles innovantes avec React Native.",
        lieuTravail: 'Lyon',
        entreprise: 'Sopra Steria',
        typeContrat: TypeContrat.CDD,
        salaire: '40000 - 50000€',
      },
      {
        intitule: 'Stage Développement Web',
        description:
          'Stage de 6 mois pour apprendre le développement web moderne.',
        lieuTravail: 'Bordeaux',
        entreprise: 'Thales',
        typeContrat: TypeContrat.STAGE,
        salaire: '1200€/mois',
      },
    ]);

    console.log(`✅ ${offers.length} offres d'emploi créées`);
    console.log('🎉 Base de données initialisée avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors du seeding:', error);
    throw error;
  }
};
