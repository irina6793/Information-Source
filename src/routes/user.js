const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/users/signup", userController.signup);
router.post("/users", userController.create);
router.get("/user/sign_in", userController.signIn);
router.post("/user/sign_in", userController.signIn);
router.get("/users/sign_out", userController.signOut);


module.exports = router;
