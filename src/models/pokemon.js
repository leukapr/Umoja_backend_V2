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
      allowNull: false
    },
    hp: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    cp: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    picture: {
      type: DataTypes.STRING,
      allowNull: false
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
      } 
    }
  }, {
    timestamps: true,
    createdAt: 'created',
    updatedAt: false
  })
}