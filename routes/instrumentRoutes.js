const express = require("express");
const router = express.Router();
const instrumentController = require("../controllers/instrumentController"); 

router.get('/fetchData',instrumentController.fetchData)

module.exports = router;
