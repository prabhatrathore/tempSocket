const express = require("express");
const router = express.Router();
const instrumentController = require("./controller"); 

router.get('/fetchData',instrumentController.fetchData)

module.exports = router;
