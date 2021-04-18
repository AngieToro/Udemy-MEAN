const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserModel = require("../models/userMongo");

exports.createUser = (req, res, next) => {

  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new UserModel({
        email: req.body.email,
        password: hash
      });

    //se guarda en la base de datos
    user.save()
        .then(result => {
          res.status(201).json({
            message: 'User created',
            result: result
          });
        })
        .catch(error => {
          res.status(500).json({
            message: "Invalid authentication credentials"
          });
        });
    });
}

//verificar que el login es correcto
exports.loginUser = (req, res, next) => {

  let fetchedUser;

  //findOne When executed, the first found document is passed to the callback.
  UserModel.findOne({ email: req.body.email})
            .then(user => {
              //console.log(user);
              if (!user){   //si el usuario no se encuentra en la BD
                return res.status(401).json({
                  message: "Auth failed"
                });
              }
              fetchedUser = user;
              return bcrypt.compare(req.body.password, user.password);
              //comparacion del password ingresado, el cual se encripta y se compara con el que esta en la BD
            })
            .then(result => {
              if (!result){ //contrasena invalida
                return res.status(401).json({
                  message: "Auth failed"
                });
              }
                // crea un token
              const token = jwt.sign(
                  { email: fetchedUser.email, userId: fetchedUser._id },
                  process.env.JWT_KEY,
                  { expiresIn: "1h" }
              );

              res.status(200).json({
                  token: token,
                  expiresIn: 3600,
                  userId: fetchedUser._id
              });
            })
            .catch(error => {
              return res.status(401).json({
                 message: "Invalid authentication credentials"
              });
            });
}
