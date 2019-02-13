const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/user/signup", userController.signup);
router.post("/user/signup", userController.create);
router.get("/user/sign_in", userController.sign_in);
router.post("/user/sign_in", userController.create);
router.get("/user/sign_out", userController.sign_out);
router.post("/user/sign_out", userController.create);

module.exports = router;
