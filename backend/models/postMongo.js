const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  imagePath: {
    type: String,
    required: true,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

//type: mongoose.Schema.Types.ObjectId -> indica que se guardara el id
//ref: hace referencia a la coleccion que se usara

//el nombre de  la coleccion sera posts.
//porque siempre es el plural del que se pone y en minusculas
module.exports = mongoose.model("Post", postSchema);
