const express = require("express");
const router = express.Router();
const orderBookController = require("../controllers/orderBookController"); // Import your businessController

router.post("/orderBookController", orderBookController.addOrderData);
router.delete(
  "/deleteObjectFromPEndingData",
  orderBookController.deleteObjectFromPEndingData
);
router.post(
  "/filterDataAccordingToBidPriceAskPrice",
  orderBookController.filterDataAccordingToBidPriceAskPrice
);

module.exports = router;
