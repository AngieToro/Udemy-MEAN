const multer = require("multer"); //para imagenes

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
}

//guarda los archvos cargados en una carpeta del proyecto
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");

    if (isValid){
      error = null;
    }

    cb (error, "backend/images");
  },

  filename: (req, file, cb) => {
    const name = file.originalname.toLocaleLowerCase().split(" ").join("-");
    const extension = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + extension);
  }
});

//el multer permite extraer cualquier archivo qe sea part de la solicitud entrante
module.exports = multer({storage: storage}).single("image");
