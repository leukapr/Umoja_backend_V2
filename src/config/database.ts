/**
 * src/config/database.ts
 * Connexion à MariaDB avec Sequelize (structure Umoja conservée)
 */
import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

// Chargement des variables d’environnement (.env)
dotenv.config();

// Création de l’instance Sequelize
export const sequelize = new Sequelize(
  process.env.DB_NAME || 'umoja',
  process.env.DB_USER || 'root',
  process.env.DB_PASS || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    dialect: 'mariadb',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true,
    },
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
);

/**
 * Connexion à la base MariaDB
 */
export async function connectDatabase(): Promise<void> {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    process.exit(1); // Stop le serveur si la connexion échoue
  }
}
