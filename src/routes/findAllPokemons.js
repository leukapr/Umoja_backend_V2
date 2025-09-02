const { Pokemon } = require("../db/sequelize");

module.exports = (app) => {
  app.get("/api/pokemons", (req, res) => {
    if (req.query.name) {
      const name = req.query.name;
      return Pokemon.findAll({ where: { name } })
        .then((pokemons) => {
          const message = `La liste des pokémons correspondant au nom ${name} a bien été récupérée.`;
          res.json({ message, data: pokemons });
        })
    }
    Pokemon.findAll().then((pokemons) => {
      const message = "La liste des pokémons a bien été récupérée.";
      res.json({ message, data: pokemons });
    })
    .catch((error) => {
      const message =
        "La liste des pokémons n'a pas pu être récupérée. Réessayez dans quelques instants.";
      res.status(500).json({ message, data: error });
    });     
  });
};
