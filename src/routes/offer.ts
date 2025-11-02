import { Router } from 'express';
import {
  createOffer,
  deleteOffer,
  getAllOffers,
  getOfferById,
  updateOffer,
} from '../controllers/offer.js';

const router = Router();

// GET /api/offers - Récupérer toutes les offres
router.get('/', getAllOffers);

// GET /api/offers/:id - Récupérer une offre par ID
router.get('/:id', getOfferById);

// POST /api/offers - Créer une nouvelle offre
router.post('/', createOffer);

// PUT /api/offers/:id - Mettre à jour une offre
router.put('/:id', updateOffer);

// DELETE /api/offers/:id - Supprimer une offre
router.delete('/:id', deleteOffer);

export default router;
