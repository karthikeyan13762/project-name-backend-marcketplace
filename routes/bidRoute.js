const express = require("express");
const router = express.Router();
const Bid = require("../models/bidModel"); // Import Bid model
const authMiddleware = require("../middlewares/authMiggleware");

// POST /api/bids/place-new-bid
router.post("/place-new-bid", authMiddleware, async (req, res) => {
  try {
    const { productId, bidAmount, message, mobile, seller, buyer } = req.body;

    // Validate input
    if (!productId || !bidAmount || !mobile || !seller || !buyer) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }

    // Save the bid
    const newBid = new Bid({
      product: productId,
      bidAmount,
      message,
      mobile,
      seller,
      buyer,
    });

    await newBid.save();
    res.json({ success: true, message: "Bid placed successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// GET /api/bids/get-all-bids
router.post("/get-all-bids", authMiddleware, async (req, res) => {
  try {
    const { product, seller, buyer } = req.body;
    // const { product } = req.body;

    // Build filters based on query parameters
    const filters = {};
    if (product) {
      filters.product = product;
    }
    if (seller) {
      filters.seller = seller;
    }
    if (buyer) {
      filters.buyer = buyer;
    }

    const bids = await Bid.find(filters)
      .populate("product")
      .populate("buyer")
      .populate("seller");
    res.send({ success: true, data: bids });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
