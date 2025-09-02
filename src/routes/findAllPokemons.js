const { Pokemon } = require("../db/sequelize");
const { Op } = require("sequelize");

module.exports = (app) => {
  app.get("/api/pokemons", (req, res) => {
    // Ici on va chercher si un paramètre de requête "name" est présent
    if (req.query.name) {
      
      const name = req.query.name;
      // On utilise la méthode findAll de Sequelize pour récupérer les pokémons
      return Pokemon.findAll({
        where: {
          name: {
            [Op.eq]: name}
        }
      })
        // On gère la promesse retournée par findAll
        .then((pokemons) => {
          const message = `Il y a ${pokemons.length} pokémons correspondant au terme de recherche ${name}.`;
          res.json({ message, data: pokemons });
        })
    }
    // Si pas de paramètre "name", on récupère tous les pokémons
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
