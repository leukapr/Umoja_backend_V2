import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

// Configuration de la connexion Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME || 'umoja_recrutement',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '3306'),
    dialect: 'mariadb',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    timezone: '+01:00', // Fuseau horaire Europe/Paris
  },
);

// Fonction pour tester la connexion
export const testConnection = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données réussie');
  } catch (error) {
    console.error('❌ Impossible de se connecter à la base de données:', error);
    process.exit(1);
  }
};

// Fonction pour synchroniser les modèles
export const syncDatabase = async (force = false): Promise<void> => {
  try {
    await sequelize.sync({ force });
    console.log(
      `✅ Base de données synchronisée ${force ? '(tables recréées)' : ''}`,
    );
  } catch (error) {
    console.error('❌ Erreur lors de la synchronisation:', error);
    throw error;
  }
};

export default sequelize;
