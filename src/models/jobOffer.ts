import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
import {
  JobOfferAttributes,
  JobOfferCreationAttributes,
  TypeContrat,
} from '../types/index.js';

// Attributs optionnels lors de la création

// Classe du modèle JobOffer
class JobOffer
  extends Model<JobOfferAttributes, JobOfferCreationAttributes>
  implements JobOfferAttributes
{
  public id!: number;
  public intitule!: string;
  public description!: string | undefined;
  public lieuTravail!: string;
  public entreprise!: string;
  public typeContrat!: TypeContrat | undefined;
  public salaire!: string | undefined;
  public externalId!: string | undefined;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialisation du modèle
JobOffer.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    intitule: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Le titre de l'offre ne peut pas être vide" },
        len: {
          args: [3, 200],
          msg: 'Le titre doit contenir entre 3 et 200 caractères',
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    lieuTravail: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Le lieu de travail ne peut pas être vide' },
      },
    },
    entreprise: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Le nom de l'entreprise ne peut pas être vide" },
      },
    },
    typeContrat: {
      type: DataTypes.ENUM(...Object.values(TypeContrat)),
      allowNull: true,
      defaultValue: TypeContrat.CDI,
    },
    salaire: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    externalId: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: {
        name: 'external_id',
        msg: 'Cette offre externe existe déjà',
      },
      comment: "ID de l'offre depuis France Travail",
    },
  },
  {
    sequelize,
    tableName: 'job_offers',
    timestamps: true,
  },
);

export default JobOffer;
