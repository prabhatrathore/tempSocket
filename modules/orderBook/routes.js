const express = require("express");
const router = express.Router();
const orderBookController = require("./controller"); // Import your businessController

router.post("/addOrderData", orderBookController.addOrderData);

router.post("/deleteObjectFromPEndingData", orderBookController.deleteObjectFromPEndingData);

router.post("/filterDataAccordingToBidPriceAskPrice", orderBookController.filterDataAccordingToBidPriceAskPrice);

module.exports = router;
