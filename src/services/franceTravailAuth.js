import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

let cachedToken = null;
let tokenExpiry = 0;

export async function getFranceTravailToken() {
  const now = Date.now();

  // 🔁 réutilise le token s’il est encore valide
  if (cachedToken && now < tokenExpiry) {
    return cachedToken;
  }

  try {
    const response = await axios.post(
      process.env.FRANCE_TRAVAIL_TOKEN_URL,
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.FRANCE_TRAVAIL_CLIENT_ID,
        client_secret: process.env.FRANCE_TRAVAIL_CLIENT_SECRET,
        scope: process.env.FRANCE_TRAVAIL_SCOPE,
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    );

    cachedToken = response.data.access_token;
    tokenExpiry = now + response.data.expires_in * 1000;

    console.log('✅ Nouveau token France Travail obtenu !');
    return cachedToken;
  } catch (error) {
    console.error(
      '❌ Erreur OAuth2 France Travail :',
      error.response?.data || error.message,
    );
    throw new Error('Impossible d’obtenir un token France Travail.');
  }
}
