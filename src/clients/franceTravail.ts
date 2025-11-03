// File: src/clients/franceTravail.ts
/*
  FranceTravailClient
  - Responsible for HTTP interaction with the France Travail API
  - Manages OAuth2 client_credentials token with in-memory caching and expiry
  - Handles errors and does not log secrets
  - Typed responses
*/

import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { z } from 'zod';
import config from '../config.js';

// --- Types ---
export const TokenResponseSchema = z.object({
  access_token: z.string(),
  token_type: z.string().optional(),
  expires_in: z.number().optional(),
});
export type TokenResponse = z.infer<typeof TokenResponseSchema>;

export const FranceTravailOfferSchema = z.object({
  id: z.union([z.string(), z.number()]).transform(String),
  intitule: z.string().optional(),
  lieuTravail: z.any().optional(),
  dateCreation: z.string().optional(),
  // Add other fields you expect and validate them
});
export type FranceTravailOffer = z.infer<typeof FranceTravailOfferSchema>;

export class FranceTravailClient {
  private axios: AxiosInstance;
  private token: string | null = null;
  private tokenExpiry: number = 0; // unix ms

  constructor() {
    if (
      !config.FRANCE_TRAVAIL_TOKEN_URL ||
      !config.FRANCE_TRAVAIL_CLIENT_ID ||
      !config.FRANCE_TRAVAIL_CLIENT_SECRET
    ) {
      throw new Error(
        'FranceTravailClient: missing configuration for FRANCE_TRAVAIL_*',
      );
    }

    this.axios = axios.create({
      baseURL:
        config.FRANCE_TRAVAIL_BASE_URL ||
        'https://api.emploi-store.fr/partenaire',
      timeout: config.HTTP_TIMEOUT_MS || 10_000,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    // Attach interceptor to automatically add Authorization header
    this.axios.interceptors.request.use(async (req) => {
      // Do not modify requests that already have an Authorization header
      if (req.headers && req.headers.Authorization) return req;

      const token = await this.getAccessToken();
      if (!req.headers) req.headers = {};
      req.headers.Authorization = `Bearer ${token}`;
      return req;
    });

    // Optional: response interceptor to handle 401 and refresh token once
    this.axios.interceptors.response.use(
      (res) => res,
      async (err) => {
        const original = err.config;
        if (err.response && err.response.status === 401 && !original._retry) {
          original._retry = true;
          // Force refresh token
          await this.forceRefreshToken();
          const token = this.token;
          if (token) {
            original.headers['Authorization'] = `Bearer ${token}`;
            return this.axios(original);
          }
        }
        return Promise.reject(err);
      },
    );
  }

  // Private helper: exchange client credentials for an access token and cache it
  private async fetchToken(): Promise<TokenResponse> {
    const body = new URLSearchParams();
    body.append('client_id', config.FRANCE_TRAVAIL_CLIENT_ID);
    body.append('client_secret', config.FRANCE_TRAVAIL_CLIENT_SECRET);
    body.append('grant_type', 'client_credentials');

    let res: AxiosResponse<any>;
    try {
      res = await axios.post(config.FRANCE_TRAVAIL_TOKEN_URL, body.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        timeout: 10_000,
      });
    } catch (err: any) {
      // Do not log sensitive details (client secret)
      throw new Error(
        `FranceTravailClient.fetchToken: token request failed (${
          err?.message || 'unknown error'
        })`,
      );
    }

    const parsed = TokenResponseSchema.safeParse(res.data);
    if (!parsed.success) {
      throw new Error(
        'FranceTravailClient.fetchToken: unexpected token response shape',
      );
    }

    return parsed.data;
  }

  private async getAccessToken(): Promise<string> {
    const now = Date.now();
    if (this.token && this.tokenExpiry > now + 5_000) {
      // token still valid (with small buffer)
      return this.token;
    }

    const tokenData = await this.fetchToken();
    this.token = tokenData.access_token;
    const ttl = tokenData.expires_in
      ? tokenData.expires_in * 1000
      : 60 * 60 * 1000; // default 1h
    this.tokenExpiry = Date.now() + ttl;
    return this.token;
  }

  // Force refresh token (used by interceptor on 401)
  private async forceRefreshToken(): Promise<void> {
    const tokenData = await this.fetchToken();
    this.token = tokenData.access_token;
    const ttl = tokenData.expires_in
      ? tokenData.expires_in * 1000
      : 60 * 60 * 1000;
    this.tokenExpiry = Date.now() + ttl;
  }

  // Public method: fetch offers with optional query params
  public async fetchOffers(
    params?: Record<string, string | number>,
  ): Promise<FranceTravailOffer[]> {
    try {
      const res = await this.axios.get('/offresdemploiv2', { params });

      // Validate shape: expecting e.g. { offres: [...] }
      const offres = res.data?.offres ?? res.data;
      if (!Array.isArray(offres)) {
        throw new Error(
          'FranceTravailClient.fetchOffers: unexpected response shape',
        );
      }

      // Validate each offer with Zod and transform
      const parsed = offres
        .map((o: any) => {
          const ok = FranceTravailOfferSchema.safeParse(o);
          if (!ok.success) {
            // For robustness, we skip invalid items instead of failing whole call
            // Alternatively, collect and log them for investigation
            return null;
          }
          return ok.data;
        })
        .filter(Boolean) as FranceTravailOffer[];

      return parsed;
    } catch (err: any) {
      // Wrap error to give context but avoid leaking secrets
      throw new Error(
        `FranceTravailClient.fetchOffers failed: ${
          err?.message || 'unknown error'
        }`,
      );
    }
  }
}
