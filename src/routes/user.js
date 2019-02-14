const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/user/signup", userController.signup);
router.post("/user", userController.create);
router.get("/user/sign_in", userController.signInForm);
router.post("/user/sign_in", userController.signIn);
router.get("/user/sign_out", userController.signOut);


module.exports = router;
