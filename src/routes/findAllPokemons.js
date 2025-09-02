const { Pokemon } = require("../db/sequelize");
const { Op } = require("sequelize");

module.exports = (app) => {
  app.get("/api/pokemons", (req, res) => {
    // Ici on va chercher si un paramètre de requête "name" est présent
    if (req.query.name) {
      
      const name = req.query.name;
      // On utilise la méthode findAll de Sequelize pour récupérer les pokémons
      return Pokemon.findAndCountAll({
        where: {// On ajoute une condition sur le nom
          name: { 
            [Op.like]: `%${name}%`  // Opérateur "like" de SQL pour faire une recherche partielle
            // Le pourcentage avant et après le terme de recherche permet de faire une recherche "contient"
          },
          
        limit : 5 // On limite le nombre de résultats à 10
        }
      })
        // On gère la promesse retournée par findAll
        .then(({count, rows}) => {
          const message = `Il y a ${count} pokémons correspondant au terme de recherche ${name}.`;
          res.json({ message, data: rows });
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
