const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");

const postsRoute = require("./routes/postsRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express()

//const uriDB = "mongodb+srv://Angie:dNOM0s6UaQxJaOOL@cluster0-c8l8g.mongodb.net/test?retryWrites=true&w=majority";
const uriDB = "mongodb://localhost/cursoDB";
//nodo-angular es el nombre de la base de datos
mongoose
        .connect(uriDB, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
          console.log("Connected to database!");
        })
        .catch(() => {
          console.log("Connect to database failed!");
        });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
app.use("/images", express.static(path.join("backend/images")));  //acceso a la carpeta iamgenes. el static indica que cualquier solicitu sera permitida

//middleware
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); //no importa en que dominio se este ejecutando la aplicacion que envia la solicitud esta permitido acceder a nuestros recurso
  res.setHeader("Access-Control-Allow-Headers",
                "Origin, x-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods",
                "GET, POST, PATCH, DELETE, PUT, OPTIONS");

  next();   //la solicitud continua viajando hasta que encuentre una respuesta
            //sino se queda procesando y por lo tanto no llega al siguiente middlwar
            //o tampoco se esta mandando nada en este.. en algun momento da timeout
});

app.use("/api/posts", postsRoute);
app.use("/api/user", userRoutes);

//exportar la app de express para poder utilizarla en nodejs
module.exports = app;
