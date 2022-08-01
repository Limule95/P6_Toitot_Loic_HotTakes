//import d'express
const express = require("express");
//Fonction router()
const router = express.Router();

//import du controllers sauce
const sauce = require("../controllers/sauces");

//Import du middleware auth pour sécuriser les routes
const auth = require("../middleware/auth");
//Import du middleware multer pour la gestion des images
const multer = require("../middleware/multer-config");

//router."index"('/', auth, sauce.ANALYSE);
//route pour envoyer toutes les sauces
router.get("/", auth, sauce.getAllSauce);
//route pour poster une sauce
router.post("/", auth, multer, sauce.createSauce);
//route pour envoyer une sauce
router.get("/:id", auth, sauce.getOneSauce);
//route pour la modification d'une sauce
router.put("/:id", auth, multer, sauce.modifySauce);
//route pour la suppréssion d'une sauce
router.delete("/:id", auth, sauce.deleteSauce);
//route pour poster un like
router.post("/:id/like", auth, sauce.likeSauce);

module.exports = router;
