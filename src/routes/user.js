const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/user/signup", userController.signUp);
router.post("/user/signup", userController.create);
router.get("/user/sign_in", userController.signInForm);
router.post("/user/sign_in", userController.signIn);
router.get("/user/sign_out", userController.signOut);
router.get("/user/:id", userController.show);
router.get("/user/upgrade", userController.upgrade);
router.post("/user/downgrade", userController.downgrade);

module.exports = router;
