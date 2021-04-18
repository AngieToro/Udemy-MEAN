const jwt = require("jsonwebtoken");

//middleware
//funcion que se ejecuta en las solicitudes entrantes
//obtiene el token y lo validara
//permite ver cuales son las rutas qe se quieren proteger (que estaran restringidas)
//se coloca en las rutas despues de la ruta, pero antes de la logica
module.exports = (req, res, next) => {

  try{
    const token = req.headers.authorization.split(" ")[1];
    //en el haeder estara Beader 345535, entonces se obtiene el 345535 que es el token

    const decodedToke = jwt.verify(token, process.env.JWT_KEY);
    //process.env.JWT_KEY viene del archivo nodemon.json que se definen las variables de ambiene por parte de node
    //al ponerlo hay que reiniciar el server
    req.userData = {
      email: decodedToke.email,
      userId: decodedToke.userId
    }; //esta informacion viene /routes/user/login

    next(); //permite ir al siguiente middleware y mantiene todos los datos

  } catch (error){
    res.status(401).json({
      message: "You are not authenticated"
    });
  }
}
