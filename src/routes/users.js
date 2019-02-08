const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/users/signup", userController.signup);
router.get("/", (req, res) => {
  res.render("index");
});


module.exports = router;
