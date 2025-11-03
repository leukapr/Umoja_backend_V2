// src/config/database.ts
import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

// Charger les variables d'environnement depuis .env
dotenv.config();

// Vérifie la présence des variables critiques
if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_NAME) {
  console.error('❌ Missing database environment variables');
  process.exit(1);
}

// Configuration de la connexion Sequelize (MariaDB)
export const sequelize = new Sequelize(
  process.env.DB_NAME!,
  process.env.DB_USER!,
  process.env.DB_PASS || '', // mot de passe facultatif
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    dialect: 'mariadb',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    define: {
      freezeTableName: true,
      timestamps: true,
    },
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
);

// Fonction d’initialisation de la connexion
export async function connectDatabase(): Promise<void> {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to MariaDB successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    process.exit(1);
  }
}
