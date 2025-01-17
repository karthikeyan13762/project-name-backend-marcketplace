const mongoose = require("mongoose");

const BidSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    bidAmount: {
      type: Number,
      required: true,
    },
    message: {
      type: String,
    },
    mobile: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bid", BidSchema);
