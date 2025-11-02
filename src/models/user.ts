import bcrypt from 'bcrypt';
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database.js';
import { UserAttributes } from '../types/index.js';

// Attributs optionnels lors de la création
interface UserCreationAttributes
  extends Optional<UserAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public username!: string;
  public email!: string;
  public password!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // ✅ Méthode d'instance pour comparer les mots de passe
  public async comparePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: {
        name: 'username',
        msg: "Ce nom d'utilisateur est déjà pris",
      },
      validate: {
        notEmpty: { msg: "Le nom d'utilisateur ne peut pas être vide" },
        len: {
          args: [3, 50],
          msg: "Le nom d'utilisateur doit contenir entre 3 et 50 caractères",
        },
      },
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: {
        name: 'email',
        msg: 'Cet email est déjà utilisé',
      },
      validate: {
        isEmail: { msg: "L'adresse email n'est pas valide" },
        notEmpty: { msg: "L'email ne peut pas être vide" },
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Le mot de passe ne peut pas être vide' },
        len: {
          args: [6, 255],
          msg: 'Le mot de passe doit contenir au moins 6 caractères',
        },
      },
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
    hooks: {
      // 🔐 Avant la création → hash du mot de passe
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      // 🔐 Avant la mise à jour → re-hash si modifié
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  },
);

export default User;
