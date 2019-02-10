const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const validation = require("./validation");

router.get("/user/signup", userController.signup);
router.post("/user/signup", validation.validateUsers, userController.create);

module.exports = router;
