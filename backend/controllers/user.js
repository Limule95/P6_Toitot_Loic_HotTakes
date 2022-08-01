//Import modules pour sécuriser les données utilisateurs a la création/connection d'un utilisateur
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const dotenv = require("dotenv");
dotenv.config();
//route de controles de variables d'envirronement
const hashSecu = process.env.HASH_SECU;
console.log(hashSecu);

//Import du models User
const User = require("../models/User");

//Creation d'un compte
exports.signup = (req, res, next) => {
  //regexp => email
  let emailRegExp = new RegExp(
    "^[a-zA-Z0-9.-_]{2,}[@]{1}[a-zA-Z0-9.-_]{2,}[.]{1}[a-z]{2,5}$"
    //--------Paramètre du RegExp----------
    // ^ = début du texte
    // [a-zA-Z0-9.-_] = ensemble de caractères "minuscule" "MAJUSCULE" "Chifre" "Caractère spéciaux" utilisables au début de l'email
    // {2,} = Nombre de caractère compris entre "2 ou plus qu'il est possible d'écrire
    // [@] = Définie le caractère possible et {1} = le nombre de fois qu'il est possible de l'écrire.
    // [a-zA-Z0-9.-_] = ensemble de caractères "minuscule" "MAJUSCULE" "Chifre" "Caractère spéciaux" utilisables après "@".
    // {2,} = Nombre de caractère compris entre "2 ou plus qu'il est possible d'écrire
    // [.] = Définie le caractère possible et {1} = le nombre de fois qu'il est possible de l'écrire.
    // [a-z] = ensemble de caractères "minuscule" utilisables pour définir l'extension de l'email
    // {2,3} = Nombre de caractère compris entre "2 ou 3" qu'il est possible d'écrire
    // $ = Désigne la fin de mon expression régulière
  );
  if (!emailRegExp.test(req.body.email)) {
    console.log("string");
    return res.status(401).send({ error: "Format d'adrese email invalide!" });
  }

  bcrypt
    //.hash(req.body.password, 10)  difficulter du hash password.

    .hash(req.body.password, parseInt(hashSecu))
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: " Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
//Connection a un compte
exports.login = (req, res, next) => {
  //regexp => email
  let emailRegExp = new RegExp(
    "^[a-zA-Z0-9.-_]{2,}[@]{1}[a-zA-Z0-9.-_]{2,}[.]{1}[a-z]{2,5}$"
    //--------Paramètre du RegExp----------
    // ^ = début du texte
    // [a-zA-Z0-9.-_] = ensemble de caractères "minuscule" "MAJUSCULE" "Chifre" "Caractère spéciaux" utilisables au début de l'email
    // {2,} = Nombre de caractère compris entre "2 ou plus qu'il est possible d'écrire
    // [@] = Définie le caractère possible et {1} = le nombre de fois qu'il est possible de l'écrire.
    // [a-zA-Z0-9.-_] = ensemble de caractères "minuscule" "MAJUSCULE" "Chifre" "Caractère spéciaux" utilisables après "@".
    // {2,} = Nombre de caractère compris entre "2 ou plus qu'il est possible d'écrire
    // [.] = Définie le caractère possible et {1} = le nombre de fois qu'il est possible de l'écrire.
    // [a-z] = ensemble de caractères "minuscule" utilisables pour définir l'extension de l'email
    // {2,3} = Nombre de caractère compris entre "2 ou 3" qu'il est possible d'écrire
    // $ = Désigne la fin de mon expression régulière
  );
  if (!emailRegExp.test(req.body.email)) {
    console.log(emailRegExp);
    return res.status(401).send({ error: "Format d'adrese email invalide!" });
  }
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res
          .status(401)
          .json({ message: "Paire identifiant/mot de passe incorrecte " });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res
              .status(401)
              .json({ message: "Paire identifiant/mot de passe incorrecte " });
          }
          console.log(user);
          res.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
