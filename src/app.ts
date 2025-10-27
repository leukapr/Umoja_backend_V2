import dotenv from 'dotenv';
import express, { Application, Request, Response } from 'express';

// Charger les variables d'environnement
dotenv.config();

const app: Application = express();

// Middleware pour parser le JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route de test
app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: '✅ API Umoja Recrutement avec TypeScript',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Route de health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Gestion des routes inexistantes
app.use((req: Request, res: Response) => {
  res.status(404).json({
    message: 'Route non trouvée',
    path: req.path,
  });
});

export default app;
