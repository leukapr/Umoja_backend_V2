import dotenv from 'dotenv';

dotenv.config();

const config = {
  jwtSecret: process.env.JWT_SECRET || '',
  port: process.env.PORT || 3500,
  nodeEnv: process.env.NODE_ENV || 'development',
  db: {
    name: process.env.DB_NAME || 'umoja_recrutement',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 3306,
  },
  franceTravail: {
    clientId: process.env.FRANCE_TRAVAIL_CLIENT_ID || '',
    clientSecret: process.env.FRANCE_TRAVAIL_CLIENT_SECRET || '',
    scope: process.env.FRANCE_TRAVAIL_SCOPE || 'api_offresdemploiv2 o2dsoffre',
    tokenUrl: process.env.FRANCE_TRAVAIL_TOKEN_URL || '',
  },
};

export default config;
