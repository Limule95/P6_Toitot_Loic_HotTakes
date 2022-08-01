//Import express
const express = require("express");

//import middleware/password
const passwordCtrl = require("../middleware/passwordCtrl");

//Import controllers/user.js
const userCtrl = require("../controllers/user");
console.log("CONTENU userCtrl - routes/user.js");
console.log(userCtrl);

//Fonction router()
const router = express.Router();

//Route sigup user
router.post("/signup", passwordCtrl, userCtrl.signup);
//Route login user
router.post("/login", userCtrl.login);

//Exportation du module
module.exports = router;
