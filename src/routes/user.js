const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/user/signup", userController.signup);
router.post("/user/signup", userController.create);

module.exports = router;
