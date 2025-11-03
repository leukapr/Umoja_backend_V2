import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET must be defined in environment variables');
}

/**
 * 🟢 Inscription utilisateur
 * POST /api/auth/register
 */
export async function register(req: Request, res: Response): Promise<Response> {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ error: 'Tous les champs sont obligatoires.' });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: 'Cet email est déjà utilisé.' });
    }

    const user = await User.create({ username, email, password });
    return res
      .status(201)
      .json({ message: 'Utilisateur créé avec succès.', user });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

/**
 * 🔵 Connexion utilisateur
 * POST /api/auth/login
 */
export async function login(req: Request, res: Response): Promise<Response> {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé.' });
    }

    const valid = await user.comparePassword(password);
    if (!valid) {
      return res.status(401).json({ error: 'Mot de passe incorrect.' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '24h',
    });

    return res.json({ message: 'Connexion réussie', token });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

/**
 * 🟣 Récupérer le profil utilisateur connecté
 * GET /api/auth/me
 */
export async function getProfile(
  req: Request,
  res: Response,
): Promise<Response> {
  try {
    const user = (req as any).user;
    return res.json({ user });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
