// ----------------------------
// File: src/services/franceTravail.ts
/*
  FranceTravailService
  - Business logic layer that depends on FranceTravailClient
  - Maps raw API responses into domain models and performs validation
  - Suitable place for caching, pagination, mapping, enrichment
*/

import z from 'zod';
import { FranceTravailClient } from '../clients/franceTravail.js';

// Domain model schema (example)
export const OfferSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  location: z.any().optional(),
  createdAt: z.string().optional(),
});
export type Offer = z.infer<typeof OfferSchema>;

export class FranceTravailService {
  private client: FranceTravailClient;

  constructor(client?: FranceTravailClient) {
    // Allow dependency injection for easier testing
    this.client = client ?? new FranceTravailClient();
  }

  // Example: fetch offers and map to internal Offer type
  public async getLatestOffers(limit = 20): Promise<Offer[]> {
    // Defensive parameter validation
    if (limit <= 0 || limit > 200) limit = 20;

    try {
      // Pass query params that the API accepts (adjust keys to API spec)
      const raw = await this.client.fetchOffers({ size: limit });

      // Map and adapt fields
      const mapped = raw
        .map((r) => {
          const mappedObj = {
            id: String(r.id),
            title: r.intitule ?? '',
            location: r.lieuTravail ?? null,
            createdAt: r.dateCreation ?? null,
          };

          const parsed = OfferSchema.safeParse(mappedObj);
          if (!parsed.success) {
            // Skip invalid items but continue processing
            return null;
          }
          return parsed.data;
        })
        .filter(Boolean) as Offer[];

      return mapped;
    } catch (err: any) {
      // Add higher-level context for callers while hiding low-level details
      throw new Error(
        `FranceTravailService.getLatestOffers failed: ${
          err?.message || 'unknown error'
        }`,
      );
    }
  }
}

/*
  Usage example (not to include in production code files):

  const svc = new FranceTravailService();
  const offers = await svc.getLatestOffers(10);
  console.log(offers);

  In tests, inject a mocked FranceTravailClient:
  const mockClient = { fetchOffers: jest.fn().mockResolvedValue([...]) } as unknown as FranceTravailClient;
  const svc = new FranceTravailService(mockClient);
*/
