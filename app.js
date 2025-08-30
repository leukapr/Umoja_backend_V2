/* Les réponses JSON (Correction) : Retourner une liste de données au format JSON */

const express = require("express");
const morgan = require("morgan");
const favicons = require("serve-favicon");
const sequelize = require("./src/db/sequelize");
const bodyParser = require("body-parser");

const app = express();
const port = 3500;

app
  .use(favicons(__dirname + "/favicon.ico"))
  .use(morgan("dev"))
  .use(bodyParser.json());

sequelize
  .initDb()
  .then(() => console.log("La base de données a été initialisée avec succès"))
  .catch((error) =>
    console.error(
      "Erreur lors de l'initialisation de la base de données :",
      error
    )
  );

// Routes
require("./src/routes/createPokemon")(app);
require("./src/routes/findPokemonByPk")(app);
require("./src/routes/findAllPokemons")(app);
require("./src/routes/deletePokemon")(app);
require("./src/routes/updatePokemon")(app);

app.use(({ res }) => {
  const message = "Impossible de trouver la ressource demandée !";
  res.status(404).json({ message });
});
app.listen(port, () => {
  console.log(`L'application est lancée sur : http://localhost:${port}`);
});
