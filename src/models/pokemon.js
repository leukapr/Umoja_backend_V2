/* L’API Rest et la Base de données : Créer un modèle Sequelize */
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Pokemon', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Le nom ne peut pas être vide." },
        notNull: { msg: "Le nom est une propriété requise." }
      }
    },
    hp: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: "Utilisez uniquement des nombres entiers pour les points de vie." },
        notNull: { msg: "Les points de vie sont une propriété requise." },
        max: {
          args: [999],
          msg: "Les points de vie ne peuvent pas dépasser 999."
        }
      }
    },
    cp: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: "Utilisez uniquement des nombres entiers pour les points de dégât." },
        notNull: { msg: "Les points de dégât sont une propriété requise." },
        max: {
          args: [99],
          msg: "Les points de dégât ne peuvent pas dépasser 99."
        }
      } 
    },
    picture: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: { msg: "Utilisez uniquement une URL valide pour l'image." },
        notNull: { msg: "L'URL de l'image est une propriété requise." }
      }
    },
    types: {
      type: DataTypes.STRING,
      allowNull: false,

      // Getter et Setter pour gérer un tableau de types
      // Stockage en base sous forme de chaîne de caractères séparée par des virgules
      get() {
        return this.getDataValue('types').split(',')
      },
      // Setter pour convertir un tableau en chaîne de caractères
      set(types) {
        this.setDataValue('types', types.join())
      },
      validate: {
        isTypesValid(value) {
          if (!value) { 
            throw new Error("Un pokémon doit au moins avoir un type.")
          }
          if (value.split(',').length > 3) {
            throw new Error("Un pokémon ne peut pas avoir plus de trois types.")
          } 
        }
      }
    },
  }, {
    timestamps: true,
    createdAt: 'created',
    updatedAt: false
  })
}