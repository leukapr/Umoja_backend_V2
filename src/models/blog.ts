import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
import { BlogAttributes, BlogCreationAttributes } from '../types/index.js';

// --- Interfaces TypeScript ---

// --- Classe Sequelize ---
class Blog
  extends Model<BlogAttributes, BlogCreationAttributes>
  implements BlogAttributes
{
  public id!: number;
  public title!: string;
  public slug!: string;
  public content!: string;
  public author!: string;
  public published!: boolean;
  public publishedAt?: Date | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// --- Initialisation du modèle ---
Blog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Le titre est obligatoire.' },
        len: {
          args: [3, 200],
          msg: 'Le titre doit contenir entre 3 et 200 caractères.',
        },
      },
    },
    slug: {
      type: DataTypes.STRING(200),
      allowNull: false,
      unique: { name: 'unique_slug', msg: 'Ce slug est déjà utilisé.' },
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Le contenu ne peut pas être vide.' },
      },
    },
    author: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    published: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    publishedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'blogs',
    timestamps: true,
  },
);

export default Blog;
