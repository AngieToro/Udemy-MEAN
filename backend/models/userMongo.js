const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({

  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true }
});

//el unique no es para garanticar que el registro sea unico
//no validara los datos
//es para que moogonse pueda realizar optmizacions internas de rendimiento
//para hacer esto se debe instalar el paquete mongoose-unique-validator

//required si permite validacion, si el registro no contiene esa data si da erorr

userSchema.plugin(uniqueValidator);

//el nombre de  la coleccion sera user.
module.exports = mongoose.model('User',userSchema);
