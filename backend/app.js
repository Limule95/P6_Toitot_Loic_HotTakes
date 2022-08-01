//Import express
const express = require("express");
//Import bodyParser
const bodyParser = require("body-parser");
//Import Mongoose
const mongoose = require("mongoose");
//Import Helmet
var helmet = require("helmet");

//Import dotenv
const dotenv = require("dotenv");
dotenv.config();

//route de controles de variables d'envirronement
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbUrl = process.env.DB_URL;
console.log(dbUser);
console.log(dbPassword);
console.log(dbUrl);

//Import path
const path = require("path");

//Import des routes
const stuffRoutes = require("./routes/sauces");
const userRoutes = require("./routes/user");

//Connection à la base de donnée MongoDB
mongoose
  .connect(`mongodb+srv://${dbUser}:${dbPassword}@${dbUrl}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

//Création d'application express
const app = express();

//Header pour contourner erreurs de CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

//Rendre la requete exploitable
app.use(bodyParser.json());

//Routes attendues
app.use("/api/sauces", stuffRoutes);
app.use("/api/auth", userRoutes);
//Gestion de la ressource image de façon statique
app.use("/images", express.static(path.join(__dirname, "images")));
//Gestion de helmet pour la sécurite de l'application express
app.use(helmet());

module.exports = app;
