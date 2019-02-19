const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const validation = require("./validation");

router.get("/user/signup", userController.signup);
router.post("/user/signup", validation.validateUser, userController.create);
router.get("/user/sign_in", userController.signInForm);
router.post("/user/sign_in", validation.validateUserSignIn, userController.signIn);
router.get("/user/sign_out", userController.signOut);
router.post("/user", validation.validateUser,  userController.create);

module.exports = router;
