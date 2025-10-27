/* L’API Rest et la Base de données : Créer un modèle Sequelize */
const { Sequelize, DataTypes } = require('sequelize');
const OfferModel = require('../models/jobOffer');
const UserModel = require('../models/user');
const offers = require('./mock-offer');
const bcrypt = require('bcrypt');

const sequelize = new Sequelize('umoja', 'root', '', {
  host: 'localhost',
  dialect: 'mariadb',
  dialectOptions: {
    timezone: 'Etc/GMT-2',
  },
  logging: false,
});

const Offer = OfferModel(sequelize, DataTypes);
const User = UserModel(sequelize, DataTypes);

const initDb = () => {
  return sequelize.sync({ force: true }).then((_) => {
    offers.map((offer) => {
      Offer.create({
        intitule: offer.intitule,
        description: offer.description,
        lieuTravail: offer.lieuTravail,
        entreprise: offer.entreprise,
      }).then((offer) => console.log(offer.toJSON()));
    });

    bcrypt.hash('admin', 10).then((hash) =>
      User.create({
        username: 'admin',
        password: hash,
      }),
    );

    console.log('La base de donnée a bien été initialisée !');
  });
};

module.exports = {
  initDb,
  Offer,
  User,
};
