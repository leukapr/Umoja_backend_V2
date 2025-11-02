import app from './app.js';
import { syncDatabase, testConnection } from './config/database.js';
import { seedDatabase } from './db/seeders.js';

const PORT = process.env.PORT || 3500;

// Fonction de démarrage
const startServer = async () => {
  try {
    // 1. Tester la connexion à la base de données
    await testConnection();

    // 2. Synchroniser les modèles
    // ⚠️ { force: true } supprime et recrée les tables - À utiliser uniquement en développement !
    const forceSync = process.env.NODE_ENV === 'development';
    await syncDatabase(forceSync);

    // 3. Insérer des données de test (seulement si les tables sont recréées)
    if (forceSync) {
      await seedDatabase();
    }

    // 4. Démarrer le serveur
    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
      console.log(`📦 Environnement: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🗄️  Base de données: ${process.env.DB_NAME}`);
    });
  } catch (error) {
    console.error('❌ Erreur fatale au démarrage:', error);
    process.exit(1);
  }
};

// Lancer le serveur
startServer();
