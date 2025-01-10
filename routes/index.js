const { Router } = require("express");
const router = Router();
const controllers = require("../controllers");

router.get("/", (req, res) => {
  res.send("Welcome to Instagram!");
});

router.post("/register", controllers.registerUser);
router.post("/login", controllers.sigInUser);

router.delete("/deleteUser/:userId", controllers.deleteUser);
router.put("/updateUser/:userId", controllers.updateUser);
module.exports = router;
