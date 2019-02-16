const express = require("express");
const router = express.Router();
const wikiController = require("../controllers/wikiController");


router.post("/wiki", wikiController.create);


module.exports = router;
