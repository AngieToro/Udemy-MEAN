const express = require("express");


const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");
const postController = require("../controllers/postController");

const router = express.Router();

//esto retorna los valores al cliente (front-end = post.service)

router.post("",
            checkAuth,
            extractFile,
            postController.createPost
);


router.get("",
          postController.getPosts
);

router.get("/:id",
          postController.getIdPost
);

router.delete("/:id",
            checkAuth,
            postController.deletePost
);

router.put("/:id",
          checkAuth,
          extractFile,
          postController.updatePost);

/* app.use((req, res, next) => {
  res.send('Hello from express');
}); */

module.exports = router;
