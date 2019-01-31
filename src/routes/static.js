const express = require("express");
const router = express.Router();
const staticController = require("../controllers/staticController");

router.get("/", staticController.index);
router.get("/about", staticController.user);

module.exports = router;
