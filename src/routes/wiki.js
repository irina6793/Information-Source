const express = require("express");
const router = express.Router();
const wikiController = require("../controllers/wikiController");

router.get("/wiki", wikiController.list);
router.post("/wiki", wikiController.create);


module.exports = router;
