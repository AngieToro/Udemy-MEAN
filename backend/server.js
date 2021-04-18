const http = require('http');
const debug = require('debug')('node-angular');

const app = require('./appExpress');

//asegurar cuando se configura el puerto y especilmente cuando se recibe a traves
//de una variable de entorno se pueda utilizar
const normalizePort = val => {
  var port = parseInt(val, 10);

  if (isNaN(port)){
    //named pipi
    return val;
  };

  if (port >= 0){
    //port number
    return port;
  };

  return false;
};

//verifica el tipo de error que ocurrio y registrara algo diferente y
//saldra correctamente del servidor nodejs
const onError = error => {

  if (error.syscall !== "listen"){
    throw error;
  };

  const bind = typeof port === "string" ? "pipe " + port : "port " + port;

  switch (error.code){

    case "EACCES":
        Console.error(bind + "requieres elevated privileges");
        process.exit(1);
        break;
    case "EADDRINUSE":
        Console.error(bind + "is already in use");
        process.exit(1);
        break;
    default:
        throw error;
  }
};

//se registra que se esta escuchando las solicitudes entrantes
const onListening = () => {

  const addr = server.address();
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  debug("Listening on " + bind);
};


const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

const server = http.createServer(app);
server.on("error= ", onError);   //indica si algo dio eror al iniciar el servidor
server.on("listening= ", onListening); //indica si todo salio bien
server.listen(port);  //se inicia el servidor
