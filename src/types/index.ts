import { Optional } from 'sequelize';

// Types pour les réponses API
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// Énumérations
export enum TypeContrat {
  CDI = 'CDI',
  CDD = 'CDD',
  STAGE = 'Stage',
  ALTERNANCE = 'Alternance',
  FREELANCE = 'Freelance',
}

// Interface User (structure de données)
export interface UserAttributes {
  id?: number;
  username: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface JobOffer (structure de données)
export interface JobOfferAttributes {
  id?: number;
  intitule: string;
  description?: string;
  lieuTravail: string;
  entreprise: string;
  typeContrat?: TypeContrat;
  salaire?: string;
  externalId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface JobOfferCreationAttributes
  extends Optional<
    JobOfferAttributes,
    | 'id'
    | 'description'
    | 'typeContrat'
    | 'salaire'
    | 'externalId'
    | 'createdAt'
    | 'updatedAt'
  > {}

export interface BlogAttributes {
  id: number;
  title: string;
  slug: string;
  content: string;
  author: string;
  published: boolean;
  publishedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export type BlogCreationAttributes = Optional<
  BlogAttributes,
  'id' | 'published' | 'publishedAt' | 'createdAt' | 'updatedAt'
>;

export interface Offer {
  id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  datePosted: string;
  contractType: string;
}
export interface OfferResponse {
  offres: Offer[];
}
interface JobOffer {
  id: string;
  title: string;
  company: string;
  location: string;
  url: string;
}
