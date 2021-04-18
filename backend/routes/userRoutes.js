const express = require("express");

const userContoler = require("../controllers/userController");

const router = express.Router();

router.post("/signup", userContoler.createUser);
//el createUser no se pasa como funcion createUser(), sino como referencia para que angular lo registre y lo ejecute cuando se hace una solicitud de esta ruta

router.post("/login", userContoler.loginUser);

module.exports = router;
