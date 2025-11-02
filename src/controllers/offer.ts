import { Request, Response } from 'express';
import { JobOffer } from '../models/index.js';
import type { JobOfferAttributes } from '../types/index.js';
import { ApiResponse } from '../types/index.js';

// GET /api/offers - Récupérer toutes les offres
export const getAllOffers = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const offers = await JobOffer.findAll({
      order: [['createdAt', 'DESC']], // Les plus récentes en premier
    });

    const response: ApiResponse<JobOfferAttributes[]> = {
      success: true,
      message: `${offers.length} offres récupérées`,
      data: offers.map((offer) => offer.toJSON()),
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des offres:', error);

    const errorResponse: ApiResponse = {
      success: false,
      message: 'Erreur serveur lors de la récupération des offres',
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    };

    res.status(500).json(errorResponse);
  }
};

// GET /api/offers/:id - Récupérer une offre par ID
export const getOfferById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const offer = await JobOffer.findByPk(id);

    if (!offer) {
      const response: ApiResponse = {
        success: false,
        message: 'Offre non trouvée',
        error: `Aucune offre avec l'ID ${id}`,
      };
      res.status(404).json(response);
      return;
    }

    const response: ApiResponse<JobOfferAttributes> = {
      success: true,
      message: 'Offre récupérée',
      data: offer.toJSON(),
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération de l'offre:", error);

    const errorResponse: ApiResponse = {
      success: false,
      message: 'Erreur serveur',
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    };

    res.status(500).json(errorResponse);
  }
};

// POST /api/offers - Créer une nouvelle offre
export const createOffer = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const newOffer = await JobOffer.create(req.body);

    const response: ApiResponse<JobOfferAttributes> = {
      success: true,
      message: 'Offre créée avec succès',
      data: newOffer.toJSON(),
    };

    res.status(201).json(response);
  } catch (error) {
    console.error("❌ Erreur lors de la création de l'offre:", error);

    // Gestion des erreurs de validation Sequelize
    if (error instanceof Error && error.name === 'SequelizeValidationError') {
      const errorResponse: ApiResponse = {
        success: false,
        message: 'Erreur de validation',
        error: error.message,
      };
      res.status(400).json(errorResponse);
      return;
    }

    const errorResponse: ApiResponse = {
      success: false,
      message: "Erreur serveur lors de la création de l'offre",
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    };

    res.status(500).json(errorResponse);
  }
};

// PUT /api/offers/:id - Mettre à jour une offre
export const updateOffer = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const offer = await JobOffer.findByPk(id);

    if (!offer) {
      const response: ApiResponse = {
        success: false,
        message: 'Offre non trouvée',
        error: `Aucune offre avec l'ID ${id}`,
      };
      res.status(404).json(response);
      return;
    }

    await offer.update(req.body);

    const response: ApiResponse<JobOfferAttributes> = {
      success: true,
      message: 'Offre mise à jour avec succès',
      data: offer.toJSON(),
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour de l'offre:", error);

    if (error instanceof Error && error.name === 'SequelizeValidationError') {
      const errorResponse: ApiResponse = {
        success: false,
        message: 'Erreur de validation',
        error: error.message,
      };
      res.status(400).json(errorResponse);
      return;
    }

    const errorResponse: ApiResponse = {
      success: false,
      message: 'Erreur serveur lors de la mise à jour',
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    };

    res.status(500).json(errorResponse);
  }
};

// DELETE /api/offers/:id - Supprimer une offre
export const deleteOffer = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await JobOffer.destroy({ where: { id } });

    if (!deleted) {
      const response: ApiResponse = {
        success: false,
        message: 'Offre non trouvée',
        error: `Aucune offre avec l'ID ${id}`,
      };
      res.status(404).json(response);
      return;
    }

    const response: ApiResponse = {
      success: true,
      message: 'Offre supprimée avec succès',
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("❌ Erreur lors de la suppression de l'offre:", error);

    const errorResponse: ApiResponse = {
      success: false,
      message: 'Erreur serveur lors de la suppression',
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    };

    res.status(500).json(errorResponse);
  }
};
