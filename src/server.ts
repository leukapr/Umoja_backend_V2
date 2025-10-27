import app from './app.js';

const PORT = process.env.PORT || 3500;

app.listen(PORT, () => {
  console.log(`🚀 Serveur TypeScript démarré sur http://localhost:${PORT}`);
  console.log(`📦 Environnement: ${process.env.NODE_ENV || 'development'}`);
});
