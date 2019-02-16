const express = require("express");
const router = express.Router();
const wikiController = require("../controllers/wikiController");

router.get("/wiki/update", wikiController.update);
router.post("/wiki", wikiController.create);


module.exports = router;