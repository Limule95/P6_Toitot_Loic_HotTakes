//Import Mongoose
const mongoose = require("mongoose");
//Import mongoose-unique-validator
const uniqueValidator = require("mongoose-unique-validator");

//Model users
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
//Plugin pour garantir un email unique
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("user", userSchema);
