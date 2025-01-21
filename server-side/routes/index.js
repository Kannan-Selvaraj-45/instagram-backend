const express = require("express");
const router = express.Router();
const controllers = require("../controllers");
const authorize = require("../middlewares");

// Welcome route
router.get("/", (req, res) => {
  res.send("Welcome to the Social Media API!");
});

// Auth routes
router.post("/register", controllers.registerUser);
router.post("/login", controllers.sigInUser);

// User routes
router
  .route("/users/:userId")
  .put(authorize, controllers.updateUser)
  .delete(authorize, controllers.deleteUser);

// Post routes
router.post("/posts", authorize, controllers.createPost);
router
  .route("/posts/:postId")
  .put(authorize, controllers.updatePost)
  .delete(authorize, controllers.deletePost);

// Comment routes
router.post("/comments", authorize, controllers.createComment);
router
  .route("/comments/:commentId")
  .put(authorize, controllers.updateComment)
  .delete(authorize, controllers.deleteComment);

// Like route
router.post("/likes", authorize, controllers.likePost);

// Get all posts with comments and likes
router.get("/posts", authorize, controllers.getAllPostsWithCommentsAndComments);

module.exports = router;
