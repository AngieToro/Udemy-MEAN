const PostModel = require("../models/postMongo");

exports.createPost = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");

  const post = new PostModel({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId,
  });

  console.log("decodificacion token= ", req.userData);
  //return res.status(200).json();  //al estar este return duelve ese valor y termina la ejecucio, es decir no hacer el insert en la BD
  post
    .save()
    .then((createdPost) => {
      res.status(201).json({
        message: "Post added successfully",
        post: {
          ...createdPost, //copia todas las propiedades del objeto,
          id: createdPost._id, //se sobreescribe el id
        },
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Creating a post failed",
      });
    }); //se guarda en la base de datos
};

exports.getPosts = (req, res, next) => {
  /* const posts = [
    {
      id: "fffefefefee",
      title: "Firsts server-side post",
      content: "This is coming from the server"
    },
    {
      id: "5yre6y4e",
      title: "Second server-side post",
      content: "This is coming from the server"
    }
  ]; */

  const pageSize = +req.query.pageSize; //el + convierte el valor en numero. porque todo lo que viene de req es string
  const currentPage = +req.query.page;
  const postQuery = PostModel.find();
  let fetchedPost;

  if (pageSize && currentPage) {
    postQuery
      .skip(pageSize * (currentPage - 1)) //no buscara los registros que esten antes de los q se quieren obtener, es decir si se esta en la pagina 2 con 10 elementos, se obviaran 10 elemetos de la pagina 1
      .limit(pageSize); //limita la consulta a determinados elemtnos por pagina
  }

  //busca todo en la base de datos
  postQuery
    .then((documents) => {
      fetchedPost = documents;
      return PostModel.count();
    })
    .then((count) => {
      res.status(200).json({
        message: "Posts fetched succesfully",
        posts: fetchedPost,
        maxPosts: count
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Fetching posts failed",
      });
    });
};

exports.getIdPost = (req, res, next) => {
  PostModel.findById(req.params.id)
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "Post not found" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Fetching post failed",
      });
    });
};

exports.deletePost = (req, res, next) => {
  PostModel.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then((result) => {
      //console.log(result);
      if (result.n > 0) {
        res.status(200).json({
          message: "Post deleted",
        });
      } else {
        res.status(401).json({
          message: "Not authorized",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Could not deleted post",
      });
    });
};

exports.updatePost = (req, res, next) => {
  let imagePath = req.body.imagePath; //el que se tiene

  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename; //o sereemplaza por el nuevo
  }

  const post = new PostModel({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    userId: req.userData.userId,
  });
  console.log("post a modificar= ", post);

  PostModel.updateOne(
    { _id: req.params.id, creator: req.userData.userId },
    post
  )
    .then((result) => {
      //console.log(result);  //permite ver l resultado y los parametros involucrados

      if (result.n > 0) {
        res.status(200).json({
          message: "Updated successful",
        });
      } else {
        res.status(401).json({
          message: "Not authorired",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Could not updated post",
      });
    });
};


