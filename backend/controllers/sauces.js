//Import du model de la sauce
const Sauce = require("../models/Sauces");
//Package file system pour modifier le système de donnée pour la foncion delete
const fs = require("fs");
const { log } = require("console");
const Sauces = require("../models/Sauces");

//Création d'une sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  delete sauceObject._userId;
  const sauce = new Sauce({
    ...sauceObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  sauce
    .save()
    .then(() => {
      res.status(201).json({ message: "Objet enregistré !" });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};
//Modification d'une sauce
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  delete sauceObject._userId;
  Sauce.findOne({ _id: req.params.id })
    .then((thing) => {
      if (thing.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        Sauce.updateOne(
          { _id: req.params.id },
          { ...sauceObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "Objet modifié!" }))
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};
//Supprimer une sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Objet supprimé !" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};
//Récupère une sauce unique par l'id
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};
//Récupération de toutes les sauces
exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(400).json({ error }));
};

//Like sauce
exports.likeSauce = (req, res, next) => {
  console.log("je suis dans le controller like");

  //affichage du req.body
  console.log("-->CONTENUE req.body - ctrl like");
  console.log(req.body);

  //récupérer l'id dans l'url de la requête
  console.log("--->CONTENUE req.params - ctrl like");
  console.log(req.params);

  //mise au format de l'id pour pouvoir aller chercher l'objet correspondant dans la base de donée
  console.log("--->id en _id");
  console.log({ _id: req.params.id });

  //aller chercher l'objet dans la base de donnée
  Sauces.findOne({ _id: req.params.id })
    .then((objet) => {
      console.log("--->CONTENU resulta promise : objet");
      console.log(objet);

      //like = 1 (like = +1)
      //--> utilisation de la méthode javascript includes()
      //--> utilisation de l'opérateur $inc (mongoDB)
      //--> utilisation de l'opérateur $push (mongoDB)
      //--> utilisation de l'opérateur $pull (mongoDB)

      //si le userLiked est FALSE & si like === 1
      if (!objet.usersLiked.includes(req.body.userId) && req.body.like === 1) {
        console.log(
          "---> userId n'est pas dans userLiked BDD et requete front like a 1"
        );
        //mise a jour objet Base de donnée 'BDD'
        Sauces.updateOne(
          { _id: req.params.id },
          {
            $inc: { likes: 1 },
            $push: { usersLiked: req.body.userId },
          }
        )
          .then(() => res.status(201).json({ message: "ficheUser like +1" }))
          .catch((error) => res.status(404).json({ error }));
      }

      //like = 0 (like = 0, pas de vote)
      if (objet.usersLiked.includes(req.body.userId) && req.body.like === 0) {
        console.log("---> userId est pas dans userLiked & like = 0");

        //mise a jour objet Base de donnée 'BDD'
        Sauces.updateOne(
          { _id: req.params.id },
          {
            $inc: { likes: -1 },
            $pull: { usersLiked: req.body.userId },
          }
        )
          .then(() => res.status(201).json({ message: "ficheUser like 0" }))
          .catch((error) => res.status(404).json({ error }));
      }

      //like = -1 (dislike = +1)
      if (
        !objet.usersDisliked.includes(req.body.userId) &&
        req.body.like === -1
      ) {
        console.log("---> userId est dans usersDisliked & dislike = 1");

        //mise a jour objet Base de donnée 'BDD'
        Sauces.updateOne(
          { _id: req.params.id },
          {
            $inc: { dislikes: 1 },
            $push: { usersDisliked: req.body.userId },
          }
        )
          .then(() => res.status(201).json({ message: "ficheUser dislike +1" }))
          .catch((error) => res.status(404).json({ error }));
      }

      //Après un like = -1, on met un like = 0 (like = 0, pas de vote, on enlève le dislike)
      if (
        objet.usersDisliked.includes(req.body.userId) &&
        req.body.like === 0
      ) {
        console.log("---> userId est pas dans usersDisliked & like = 0");

        //mise a jour objet Base de donnée 'BDD'
        Sauces.updateOne(
          { _id: req.params.id },
          {
            $inc: { dislikes: -1 },
            $pull: { usersDisliked: req.body.userId },
          }
        )
          .then(() => res.status(201).json({ message: "ficheUser like 0" }))
          .catch((error) => res.status(404).json({ error }));
      }
    })
    .catch((error) => res.status(404).json({ error }));
};
