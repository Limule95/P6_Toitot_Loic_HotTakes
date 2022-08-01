//Importation de password-validator
const passwordValidator = require("password-validator");

//Création du schéma
const passwordSchema = new passwordValidator();

//Le schéma que doit respecter le mot de passe
passwordSchema
  .is()
  .min(5) // Minimum length 5
  .is()
  .max(20) // Maximum length 20
  .has()
  .uppercase() // Must have uppercase letters
  .has()
  .lowercase() // Must have lowercase letters
  .has()
  .digits(2) // Must have at least 2 digits
  .has()
  .not()
  .spaces() // Should not have spaces
  .is()
  .not()
  .oneOf(["Passw0rd", "Password123", "Azerty1", "Azerty123"]); // Blacklist these values

console.log("---->CONTENU passwordSchema");
console.log(passwordSchema);
// Vérification de la qualité du password par rapport au schéma
console.log(passwordSchema.validate("validPASS123"));
// => true
console.log(passwordSchema.validate("invalidPASS"));
// => false

module.exports = (req, res, next) => {
  if (passwordSchema.validate(req.body.password)) {
    next();
  } else {
    return res.status(400).json({
      error: `Le mot de passe n'est pas assez fort ${passwordSchema.validate(
        "req.body.password",
        { list: true }
      )}`,
    });
  }
};
