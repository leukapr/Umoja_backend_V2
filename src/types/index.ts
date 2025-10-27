// Types personnalisés pour votre application

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface JobOffer {
  id: number;
  intitule: string;
  description: string;
  lieuTravail: string;
  entreprise: string;
  typeContrat?: 'CDI' | 'CDD' | 'Stage' | 'Alternance' | 'Freelance';
  salaire?: string;
  createdAt: Date;
  updatedAt: Date;
}
